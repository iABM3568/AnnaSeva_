# AnnaSeva (FoodBridge) — Engineering Progress Report: Day 3

**Project:** AnnaSeva / FoodBridge (Surplus Food Redistribution Platform)  
**Milestone:** Day 3 — The Listings & Geospatial API  
**Technology Stack:** Node.js, Express.js (v5), MongoDB Atlas, Mongoose (v9), Zod (v3/v4), GeoJSON, 2dsphere Spatial Index  
**Repository:** [https://github.com/iABM3568/AnnaSeva_](https://github.com/iABM3568/AnnaSeva_)  
**Current Branch:** `main` (Synced with GitHub)

---

## Executive Summary

On **Day 3**, we implemented the core business functionality of AnnaSeva: **Food Listings and Geospatial Proximity Discovery**. 

With user authentication established on Day 2, Day 3 allows verified food donors (hotels, restaurants, caterers) to post surplus food with pickup deadlines and GPS coordinates, and enables local NGOs to search for available food within a configurable radius (e.g., 5 km, 10 km), with results automatically sorted nearest-first and expired items excluded in real time.

---

## 1. Key Architectural Concepts Mastered

### 1.1 Referencing vs. Embedding (ADR 002)
* **Design Decision:** Stored the donor's ID as a reference (`donor: { type: ObjectId, ref: 'User' }`) rather than duplicating the donor's name and contact information inside the listing.
* **Why:** Provides a **single source of truth**. If a restaurant updates its business name or phone number, all historical and active listings reflect the update automatically without requiring expensive mass-updates.

### 1.2 GeoJSON Point Specification & Coordinate Ordering
* **Standard Format:** `{ type: 'Point', coordinates: [longitude, latitude] }`
* **Critical Rule:** In GeoJSON, **Longitude comes FIRST, Latitude comes SECOND** (`[x, y] = [lng, lat]`). 
* Inverting them is the #1 geographic software flaw that places coordinates in the wrong hemisphere or ocean. The API accepts intuitive `latitude` and `longitude` fields, and the server maps them into the standardized `[longitude, latitude]` array.

### 1.3 Spherical Geometry & the `2dsphere` Index
* **The Index:** `listingSchema.index({ location: '2dsphere' })`
* **Why:** The Earth is curved. A flat 2D index distorts distance over large areas. A `2dsphere` index computes accurate spherical distances (WGS84 datum). MongoDB **requires** a `2dsphere` index to run `$near` spatial queries; without it, the query fails with a planner error.

### 1.4 Dynamic Computed Expiry vs. Background Cron Jobs (ADR 003)
* **Design Decision:** Food availability is evaluated dynamically at query time using `{ expiresAt: { $gt: new Date() } }` instead of having a background cron job periodically mutate a status string to `'expired'`.
* **Why:**
  1. **Zero Latency Gaps:** Eliminates the stale window between cron executions where expired food would still be displayed.
  2. **Zero Operational Overhead:** No background workers, Redis queues, or cron lock mechanisms required.
  3. **Data Integrity:** Listings retain their true operational state (`available`, `claimed`, `completed`, `cancelled`) for accurate analytical reporting.

### 1.5 Defense Against IDOR (Insecure Direct Object Reference)
* Role-based access control (`restrictTo('donor')`) only verifies that a user *is a donor*. It does not prevent Donor A from viewing or tampering with Donor B's listings.
* We enforce **resource-level ownership** by strictly binding queries to `{ donor: req.user.id }` extracted from the verified JWT.

### 1.6 Performance Optimization: `.lean()` and `.limit(50)`
* `getNearby` uses `.lean()`, returning plain JavaScript objects instead of heavy Mongoose Documents, dramatically reducing memory overhead for high-traffic read operations.
* `.limit(50)` prevents unbounded queries from exhausting server memory.

---

## 2. Day 3 File Additions & Modifications

```text
AnnaSeva2/
├── docs/
│   ├── DAY_3_REPORT.md                        # (NEW) Day 3 comprehensive progress report
│   └── decisions.md                           # (UPDATED) Appended ADR 002 & ADR 003
├── .thunderclient/
│   └── thunder-collection_FoodBridge.json     # (UPDATED) Full Auth + Listings test collection
└── server/
    ├── app.js                                 # (UPDATED) Mounted /api/listings routes
    ├── models/
    │   └── Listing.js                         # (NEW) Listing schema & 3 compound/spatial indexes
    ├── validators/
    │   └── listing.schema.js                  # (NEW) Zod schemas for create & nearby search
    ├── controllers/
    │   └── listing.controller.js              # (NEW) createListing, getMyListings, getNearby, getMyClaims
    └── routes/
        └── listing.routes.js                  # (NEW) Role-gated listing routes
```

---

## 3. Implementation Details

### 3.1 Listing Model ([`server/models/Listing.js`](file:///Users/iabm3568/AnnaSeva2/server/models/Listing.js))
* **Fields:**
  * `title`: String (3-100 characters, trimmed).
  * `description`: String (max 500 characters, optional).
  * `foodType`: Enum (`veg`, `non-veg`, `vegan`, `mixed`).
  * `quantity`: Number (1 to 10,000 portions).
  * `preparedAt`: Date (timestamp when cooked).
  * `expiresAt`: Date (strict deadline after which food is not offered).
  * `pickupAddress`: String (max 200 characters).
  * `location`: GeoJSON Point with `coordinates: [longitude, latitude]`.
  * `donor`: ObjectId reference to `User`.
  * `status`: Enum (`available`, `claimed`, `completed`, `cancelled`).
  * `claimedBy`: ObjectId reference to `User` (default: null).
  * `claimedAt`, `completedAt`: Timestamps.
* **Three Database Indexes:**
  1. `listingSchema.index({ location: '2dsphere' })` — Powers `$near` spatial search.
  2. `listingSchema.index({ donor: 1, createdAt: -1 })` — Optimizes donor dashboard queries.
  3. `listingSchema.index({ claimedBy: 1, claimedAt: -1 })` — Optimizes NGO claim history queries.

### 3.2 Zod Validation Schemas ([`server/validators/listing.schema.js`](file:///Users/iabm3568/AnnaSeva2/server/validators/listing.schema.js))
* **`blankIsMissing` Helper:** Preprocesses empty strings (`""`) and `null` to `undefined` before coercion, preventing empty inputs from defaulting to `0` or `1970`.
* **`createListingSchema` Refinements:**
  1. Preparation time cannot be in the future (with 1-minute server clock tolerance).
  2. Expiry must be in the future (`expiresAt > Date.now()`).
  3. Expiry must be after preparation time (`expiresAt > preparedAt`).
  4. **24-Hour Food Safety Window:** Surplus food cannot be listed for more than 24 hours into the future (`expiresAt - now <= 24h`).
  5. **Mass-Assignment Defense:** Strips `status`, `donor`, `claimedBy`, and extra parameters from the client.
* **`nearbySchema`:**
  * Validates query string parameters: `lat` (-90 to 90), `lng` (-180 to 180), and `radiusKm` (0.5 to 50 km, default: 10 km).

### 3.3 Controllers ([`server/controllers/listing.controller.js`](file:///Users/iabm3568/AnnaSeva2/server/controllers/listing.controller.js))
* **`createListing`:** Pulls `latitude` and `longitude` from `req.valid`, builds GeoJSON `[longitude, latitude]`, sets `donor: req.user.id`, and creates the record.
* **`getMyListings`:** Queries `{ donor: req.user.id }`, sorts newest-first, and populates `claimedBy` with safe user fields.
* **`getNearby`:** Converts `radiusKm` into meters (`radiusKm * 1000`), executes `$near` query on `location_2dsphere`, excludes expired items with `{ expiresAt: { $gt: new Date() } }`, applies `.limit(50)`, and `.lean()`.
* **`getMyClaims`:** Queries `{ claimedBy: req.user.id }` and populates donor information.

### 3.4 Routes ([`server/routes/listing.routes.js`](file:///Users/iabm3568/AnnaSeva2/server/routes/listing.routes.js))
* Global `router.use(protect)` ensures every listing endpoint requires a valid JWT.
* `POST /` $\rightarrow$ `restrictTo('donor')`, `validate(createListingSchema)`
* `GET /mine` $\rightarrow$ `restrictTo('donor')`
* `GET /nearby` $\rightarrow$ `restrictTo('ngo')`, `validate(nearbySchema, 'query')`
* `GET /claimed` $\rightarrow$ `restrictTo('ngo')`

---

## 4. API Reference Summary

| Method | Endpoint | Allowed Role | Key Request Data | Expected Status |
|---|---|---|---|---|
| `POST` | `/api/listings` | `donor` | Title, quantity, preparedAt, expiresAt, lat, lng, address | **201 Created** |
| `GET` | `/api/listings/mine` | `donor` | None (reads `req.user.id` from JWT) | **200 OK** |
| `GET` | `/api/listings/nearby` | `ngo` | Query params: `?lat=18.52&lng=73.85&radiusKm=5` | **200 OK** |
| `GET` | `/api/listings/claimed` | `ngo` | None (reads `req.user.id` from JWT) | **200 OK** |

---

## 5. Live Test Results (15/15 Passed Against MongoDB Atlas)

| # | Test Scenario | Verified Behavior | Status |
|---|---|---|---|
| 1 | Donor creates listing | Returns `201 Created`, `status: "available"` | **PASS ✅** |
| 2 | NGO attempts creating listing | Blocked with `403 Forbidden` | **PASS ✅** |
| 3 | Unauthenticated request | Blocked with `401 Unauthorized` | **PASS ✅** |
| 4 | Missing `title` | Rejected with `400 Bad Request` | **PASS ✅** |
| 5 | `expiresAt` in past | Rejected with `400 Bad Request` | **PASS ✅** |
| 6 | `expiresAt` > 24 hours ahead | Rejected with `400 Bad Request` (24h safety rule) | **PASS ✅** |
| 7 | Invalid `latitude: 200` | Rejected with `400 Bad Request` | **PASS ✅** |
| 8 | Client sends `"status": "completed"` | Sanitized by Zod; saved with `status: "available"` | **PASS ✅** |
| 9 | Coordinates array inspection | Saved as `[73.8567, 18.5204]` (Longitude first!) | **PASS ✅** |
| 10 | NGO nearby search within 5 km | Finds available food in Pune | **PASS ✅** |
| 11 | NGO nearby search 100 km away | Returns empty array (`count: 0`) | **PASS ✅** |
| 12 | Nearest-first sort order | Returns Spot A (1km) $\to$ Spot B (3km) $\to$ Spot C (8km) | **PASS ✅** |
| 13 | Cross-role endpoint access | Donor on `/nearby` = 403; NGO on `/mine` = 403 | **PASS ✅** |
| 14 | Resource isolation (IDOR) | Donor 2 cannot view Donor 1's listings | **PASS ✅** |
| 15 | Atlas Index Verification | `location_2dsphere` verified in MongoDB Atlas | **PASS ✅** |

---

## 6. MongoDB Atlas Index Verification

Verified on the live database cluster:

```json
[
  { "name": "_id_", "key": { "_id": 1 } },
  { "name": "location_2dsphere", "key": { "location": "2dsphere" } },
  { "name": "donor_1_createdAt_-1", "key": { "donor": 1, "createdAt": -1 } },
  { "name": "claimedBy_1_claimedAt_-1", "key": { "claimedBy": 1, "claimedAt": -1 } }
]
```

---

## 7. Git Commit Log

```text
* 307e196 (HEAD -> main, origin/main, feature/listings) chore: normalize trailing newlines on Day 3 listing files
* 573a092 docs(listings): add ADRs 002-003, journal reflections and Thunder Client collection
* 5b75579 feat(listings): add listing controllers, routes and app integration
* ee37b3a feat(listings): add Zod schemas for listing creation and nearby search
* 7f342eb feat(listings): add Listing model with 2dsphere and compound indexes
```

---

## 8. Looking Ahead to Day 4

With listings published and geospatial search operating, **Day 4** focuses on **The Claim System & System-Design Lab**:
1. **Atomic Concurrency:** Eliminating race conditions using MongoDB's atomic `findOneAndUpdate` so two NGOs clicking "Claim" at the same millisecond can never both win the same food.
2. **Claim Lifecycle:** Implementing claim, cancel, and pickup/completion transitions.
3. **Idempotency & State Machine Guards:** Enforcing valid state transitions (`available` $\to$ `claimed` $\to$ `completed` / `cancelled`).

