# AnnaSeva (अन्न सेवा)

> **Connecting surplus edible food with nearby NGOs before it spoils.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![Tests Passing](https://img.shields.io/badge/Tests-23%2F23%20Passing-brightgreen.svg)](#testing)
[![Live Demo](https://img.shields.io/badge/Demo-Vercel%20%2B%20Render-teal.svg)](https://annaseva.vercel.app)

[Live Application](https://annaseva.vercel.app) · [Backend Health Check](https://annaseva-api.onrender.com/api/health) · [GitHub Repository](https://github.com/iABM3568/AnnaSeva_) · [Demo Video](docs/demo-video.md)

> ⚠️ **Hosting Note:** The live demo is deployed on free-tier cloud infrastructure (Vercel & Render). If the application has been idle, the Render backend service spins down to conserve resources and may take 45–60 seconds to complete its initial cold wake-up.

---

## The Problem

Commercial kitchens, banquet halls, restaurants, corporate cafeterias, and hostel messes frequently end daily operations with dozens of servings of freshly cooked, safe, edible surplus food. Simultaneously, local shelters, orphanages, and volunteer food distribution NGOs struggle daily to source meals for vulnerable populations.

The core barrier is **time and coordination**. Cooked meals degrade rapidly (typically safe for consumption within 4 to 6 hours). Without immediate visibility into what food is available nearby, edible food is routinely discarded into landfills while community kitchens operate with empty pots.

**AnnaSeva** eliminates this friction. Donors post surplus food in under 60 seconds; nearby verified NGOs receive instant push alerts on an interactive map, and an atomic claiming engine guarantees that exactly one NGO secures the pickup without duplicate allocations or communication breakdowns.

---

## What It Does

- **For Food Donors:**
  - Create food listings in seconds specifying quantity (estimated servings), dietary type (Veg, Non-Veg, Vegan, Mixed), preparation time, pickup deadline, and address.
  - Automatically captures GPS coordinates via the HTML5 Geolocation API with manual fallback.
  - Track active, claimed, cancelled, and fulfilled listings from a dedicated dashboard.
  - Receive real-time socket alerts the instant an NGO claims a donation, showing the NGO's organization and contact details.
  - Confirm completed pickups with a single click.

- **For NGO Partners:**
  - Discover available food donations within customizable search radiuses (5 km, 10 km, 20 km, 50 km) using MongoDB `2dsphere` geospatial indexing.
  - Explore donations through an interactive Leaflet map featuring real-time cluster markers, color-coded dietary badges, and road distance calculations.
  - Receive live, zero-refresh updates whenever a nearby donor publishes new food.
  - Claim surplus food with one-click atomic reservation, instantly locking out competing claims.
  - View full donor pickup details, contact numbers, and turn-by-turn navigation links via Google Maps.

- **For Communities & Transparency:**
  - Real-time impact counter aggregating total meals rescued and completed pickups via database aggregation pipelines.

---

## Visual Walkthrough

| Landing & Live Impact Counter | NGO Real-Time Map Discovery |
|:---:|:---:|
| ![Landing Page](docs/images/landing.png) | ![NGO Map](docs/images/ngo-map.png) |

| Donor Management Dashboard | Claimed Donations & Directions |
|:---:|:---:|
| ![Donor Dashboard](docs/images/donor.png) | ![Claimed State](docs/images/claimed.png) |

<div align="center">
  <img src="docs/images/mobile.png" width="300" alt="Mobile Responsive Experience" />
  <p><em>Fully mobile-responsive layout for volunteers in the field</em></p>
</div>

---

## Technology Stack

| Layer | Technology | Purpose & Architectural Rationale |
|---|---|---|
| **Frontend Framework** | React 19 + Vite 6 | Lightning-fast HMR, component-driven UI, zero-config bundling. |
| **Routing** | React Router v7 | Declarative nested routing with role-based `<ProtectedRoute>` guards. |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive, accessible styling with high-contrast `:focus-visible` outlines. |
| **Interactive Maps** | Leaflet + React-Leaflet | Lightweight, mobile-friendly interactive mapping without heavy proprietary API keys. |
| **Backend Runtime** | Node.js (>=22.0.0) | High-performance asynchronous I/O with native `node:test` test runner. |
| **Application Server** | Express 5 | Robust HTTP routing, modular middleware chains, custom JSON error sanitization. |
| **Database & ODM** | MongoDB Atlas + Mongoose 9 | Document-oriented schema flexibility with native `2dsphere` geospatial indexing. |
| **Real-Time Engine** | Socket.IO 4.8 | Low-latency, bidirectional WebSocket events with room-based privacy segregation and fallback. |
| **Authentication** | JWT + bcryptjs | Stateless, tamper-proof bearer tokens with salted one-way password hashing (10 rounds). |
| **Schema Validation** | Zod 4 | Strict runtime schema enforcement on all client payloads before database mutations. |
| **Defensive Security** | Helmet + Express-Rate-Limit | 11 secure HTTP headers, 10 KB body size cap, brute-force rate-limiting on auth routes. |
| **Cloud Deployment** | Vercel, Render, Atlas | Production-grade separation of static CDN, API container, and managed database. |

---

## System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 / Vercel)"]
        UI["React SPA & Leaflet Map"]
        AuthCtx["AuthContext (JWT in localStorage)"]
        SocketCtx["SocketContext (WebSocket / WSS)"]
    end

    subgraph Edge ["Edge Reverse Proxy (Render / Cloudflare)"]
        TLS["TLS Termination & Header Forwarding (X-Forwarded-For)"]
    end

    subgraph Backend ["Server Layer (Node.js 22 / Express 5)"]
        Helmet["Helmet Security Headers"]
        Limiter["Rate Limiters (apiLimiter & authLimiter)"]
        Parser["JSON Body Parser (10 KB Max Limit)"]
        AuthMid["JWT Auth & Ownership Middleware"]
        ZodVal["Zod Request Validator"]
        SocketServer["Socket.IO Server (Rooms: 'ngos' & 'user:id')"]
        Controllers["Controllers & Business Logic"]
    end

    subgraph Database ["Database Layer (MongoDB Atlas Replica Set)"]
        UserCol[("Users Collection")]
        ListingCol[("Listings Collection (2dsphere Index)")]
        AggEngine["Aggregation Pipeline (Meals Rescued)"]
    end

    UI -->|"HTTPS REST Calls"| TLS
    UI <-->|"Persistent WSS Events"| TLS
    TLS -->|"req.ip via trust proxy = 1"| Helmet
    Helmet --> Limiter
    Limiter --> Parser
    Parser --> AuthMid
    AuthMid --> ZodVal
    ZodVal --> Controllers
    Controllers <-->|"Mongoose Queries"| ListingCol
    Controllers <-->|"Bcrypt / Auth"| UserCol
    Controllers -->|"Trigger Post-Write Emits"| SocketServer
    SocketServer -->|"Broadcast to Rooms"| SocketCtx
    ListingCol --> AggEngine
```

### Request Lifecycle: When an NGO Clicks "Claim"
1. **User Action:** NGO volunteer clicks "Claim Food" on listing card or map popup.
2. **Client Dispatch:** Axios dispatches `PATCH /api/listings/:id/claim` with `Authorization: Bearer <jwt>`.
3. **Gateway Hardening:** Express processes through Helmet headers, verifies body size (<10 KB), and checks IP against rate limits.
4. **Authentication:** `protect` middleware verifies JWT signature; `restrictTo('ngo')` verifies user role.
5. **Atomic Mutation:** The database executes:
   ```javascript
   const listing = await Listing.findOneAndUpdate(
     { _id: id, status: 'available', expiresAt: { $gt: new Date() } },
     { status: 'claimed', claimedBy: req.user._id, claimedAt: new Date() },
     { new: true }
   ).populate('donor', 'name organization phone email');
   ```
6. **Concurrency Gate:**
   - If document matched: Database returns updated document (`status: 200`).
   - If another NGO claimed it milliseconds earlier: Query matches 0 documents and returns `null`. Controller throws HTTP `409 Conflict`.
7. **Real-Time Notification:** After successful write, Socket.IO broadcasts:
   - Private alert to donor's room (`user:<donorId>`) with NGO details.
   - Public update to `'ngos'` room with sanitized claim status (stripping personal contact info for data minimization).
8. **Client Sync:** Competing NGO browsers immediately remove listing from active map pins; donor dashboard shifts card to "Claimed" status.

---

## Important Engineering Problems Solved

### 1. Eliminating Double-Claims Under Concurrency
- **The Vulnerability:** Naive architectures perform a read (`Listing.findById`), check `if (status === 'available')`, and then save (`listing.save()`). Under high concurrency (two NGOs claiming simultaneously), both reads succeed before either write finishes, resulting in double-allocation and donor confusion.
- **The Solution:** Implemented a single atomic conditional write using MongoDB's `findOneAndUpdate` with precondition `{ _id: id, status: 'available' }`. MongoDB's document-level write lock ensures that the condition evaluation and update execute as one indivisible operation.
- **Verification:** Verified with a 20-request concurrent stress test (`server/scripts/run-race-test.js`) executed via `Promise.all`. Exactly **1 request succeeded (HTTP 200)** and **19 requests were rejected (HTTP 409 Conflict)**.

### 2. High-Performance Geospatial Proximity Discovery
- **The Challenge:** Finding active food within 15 km of an NGO volunteer's GPS coordinates without scanning every document in the database.
- **The Solution:** Indexed listings with a MongoDB `2dsphere` index on `location: { type: 'Point', coordinates: [lng, lat] }`.
- **Query Pipeline:**
  ```javascript
  const listings = await Listing.find({
    status: 'available',
    expiresAt: { $gt: new Date() },
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: radiusKm * 1000,
      },
    },
  });
  ```
- **Gotcha Solved:** Handled coordinate order conversion. GeoJSON specifications require **`[longitude, latitude]`**, whereas Leaflet mapping and mobile geolocation provide **`[latitude, longitude]`**. Standardized conversions at the API boundaries.

### 3. Bidirectional Real-Time Communication with Graceful Reconnection
- **The Challenge:** Surplus food is time-sensitive. Volunteers cannot afford stale data or constant manual refreshes.
- **The Solution:** Socket.IO server mounted onto Express HTTP server.
  - JWT handshake authentication validates tokens before WebSocket upgrades.
  - Channel architecture isolates broadcast scopes (`'ngos'` room for discovery, `'user:<id>'` for private claim and fulfillment alerts).
  - Data minimization: Competitor NGOs receive status change alerts stripped of sensitive donor/claimer contact details.
  - Reconnection resilience: When a mobile user reconnects after a tunnel or network drop, the client triggers an authoritative REST API re-fetch to bridge any missed events.

### 4. Edge-Proxy Aware Defensive API Hardening
- **The Challenge:** Cloud edge reverse proxies (Render, Cloudflare) route traffic through internal load balancers. Standard rate limiters see the proxy's IP address instead of the client's IP, which would inadvertently throttle all users together.
- **The Solution:** Configured `app.set('trust proxy', 1)` in Express so `req.ip` reflects the true client IP from `X-Forwarded-For`.
- **Protection Architecture:**
  - `apiLimiter`: 1,000 requests per 15 minutes for general browse/search.
  - `authLimiter`: 20 requests per 15 minutes on `/register` and `/login`, with `skipSuccessfulRequests: true` so legitimate users are never penalized.
  - `GET /api/health` mounted prior to limiter so hosting health probes never exhaust quotas.
  - Helmet injects 11 secure HTTP response headers.

---

## Decisions and Trade-offs

| Decision | Alternative Considered | Why AnnaSeva Chose This | Trade-off / Cost |
|---|---|---|---|
| **Socket.IO over HTTP Polling** | Short Polling (every 5s) / Server-Sent Events (SSE) | Sub-100ms updates, bidirectional messaging, built-in reconnection logic, automatic WebSocket-to-polling fallback. | Increased server memory overhead per open socket connection; requires sticky sessions when horizontally scaling across multiple nodes. |
| **JWT in localStorage** | httpOnly / SameSite Cookies | Zero cross-domain CORS cookie configuration complexity across separate frontend (Vercel) and backend (Render) domains. | Token accessible to JavaScript; requires strict sanitization and CSP to defend against XSS vulnerabilities. |
| **Dynamic Query Expiry** | Background Cron Job setting `status: 'expired'` | Eliminates cron scheduling dependencies; zero latency lag between clock ticks and visibility; preserves original status history. | Every read query must include `{ expiresAt: { $gt: new Date() } }` filter. |
| **Referencing Donors by ID** | Embedding full donor object in listing | Prevents data duplication; profile updates (phone, organization) automatically propagate without updating thousands of historic listings. | Requires `.populate('donor')` lookup when retrieving full contact details. |
| **In-Memory Rate Limiting** | Redis-backed distributed store | Zero additional infrastructure, costs, or third-party service dependencies for MVP launch. | Counters reset when the server restarts; rate-limit buckets are per-instance rather than shared across horizontally scaled containers. |

*Detailed architectural records available in [`docs/decisions.md`](docs/decisions.md).*

---

## Run It Locally

### Prerequisites
- **Node.js**: Version 22.0.0 or higher (`node -v`)
- **Git**: Installed and configured
- **MongoDB**: Free MongoDB Atlas cluster or local MongoDB instance

### Step 1: Clone the Repository
```bash
git clone https://github.com/iABM3568/AnnaSeva_.git
cd AnnaSeva_
```

### Step 2: Configure & Start Backend Server
```bash
cd server
npm install

# Copy example environment configuration
cp .env.example .env

# Edit .env with your MongoDB Atlas URI and a strong JWT secret
# (See Environment Variables table below)

# Start development server (with watch mode on http://localhost:5000)
npm run dev
```

### Step 3: Configure & Start Frontend Client
In a separate terminal window:
```bash
cd client
npm install

# Copy example environment configuration
cp .env.example .env

# Start Vite development server (http://localhost:5173)
npm run dev
```

### Step 4: Seed Test Data (Optional)
To populate 15 sample food listings in the Pune area for testing:
```bash
cd server
node scripts/seed.js 15
```
*Creates demo accounts: `donor.demo@example.com` and `ngo.demo@example.com` (Password: `Demo@12345`).*

---

## Environment Variables

### Backend (`server/.env`)
| Variable | Example Value | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express API server listens on |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/annaseva_dev` | MongoDB connection string (must end in `_dev` for local safety) |
| `JWT_SECRET` | `super-secret-crypto-key-min-32-chars` | Secret key used to sign and verify JSON Web Tokens |
| `CLIENT_URL` | `http://localhost:5173` | Allowed origin for CORS headers and Socket.IO connections |
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |
| `RATE_LIMIT_MAX` | `1000` | Optional: Max requests per 15-minute window per IP |

### Frontend (`client/.env`)
| Variable | Example Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL for REST API requests |
| `VITE_SOCKET_URL` | `http://localhost:5000` | Base URL for Socket.IO connection (no `/api` suffix) |

---

## Testing

AnnaSeva uses Node's native test runner (`node:test` and `node:assert`). No heavy third-party testing frameworks required.

### Run Automated Unit & Integration Tests
```bash
cd server
npm test
```

### Test Coverage Breakdown (23/23 Passing)
- **17 Schema Validation Tests (`server/tests/validators.test.js`):**
  - Registration role privilege escalation prevention (`admin` role rejected).
  - Password minimum length enforcement (min 6 characters).
  - Unsanitized field stripping (`isAdmin` dropped).
  - Listing expiry time boundary checks (must be future, capped at 24 hours).
  - Temporal coherence (expiry cannot precede preparation time).
  - Geospatial coordinate boundary validation (`-90 <= lat <= 90`, `-180 <= lng <= 180`).
  - Strict type coercion (string numbers `"25"` converted safely to `25`).
- **6 Express API Integration Tests (`server/tests/api.test.js`):**
  - `GET /api/health` returns `200 { status: 'ok' }`.
  - Helmet security headers verified on responses.
  - Unknown routes answer with structured JSON 404.
  - Malformed JSON answers with 400 Bad Request (not unhandled 500).
  - Unauthenticated access to protected routes rejected with 401.
  - Oversized payloads (> 10 KB) rejected with 413 `PayloadTooLargeError`.

### Concurrency Stress Test (Race Condition)
To test atomic claim concurrency against your live MongoDB database:
```bash
cd server
node scripts/run-race-test.js
```
*Dispatches 20 simultaneous HTTP claims via `Promise.all` against a single listing. Verifies exactly 1 winner (200) and 19 conflicts (409).*

---

## API Overview

All authenticated endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Platform health and uptime monitoring |
| `GET` | `/api/stats` | Public | Live counter: total meals rescued & completed pickups |
| `POST` | `/api/auth/register` | Public | Register new Donor or NGO account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/listings/nearby` | NGO Only | Discover available listings within radius (`lat`, `lng`, `radiusKm`) |
| `POST` | `/api/listings` | Donor Only | Create surplus food donation listing |
| `GET` | `/api/listings/mine` | Donor Only | Retrieve donor's own listings with claim details |
| `PATCH` | `/api/listings/:id/claim` | NGO Only | Atomically claim an available food listing |
| `GET` | `/api/listings/claims` | NGO Only | Retrieve listings claimed by authenticated NGO |
| `PATCH` | `/api/listings/:id/complete` | Donor Only | Mark claimed listing as picked up (rescued) |
| `PATCH` | `/api/listings/:id/cancel` | Donor Only | Cancel an unclaimed active food listing |

---

## Roadmap

### Current Version (v1.0.0 — Production Ready)
- [x] Full donor posting & lifecycle management
- [x] Geospatial search with interactive Leaflet map & road distances
- [x] Atomic concurrency claim engine
- [x] Real-time bidirectional synchronization via Socket.IO
- [x] Two-tier rate limiting and Helmet API hardening
- [x] Live social impact statistics counter
- [x] 23 automated unit and integration tests

### Planned Future Enhancements
- [ ] **NGO Identity Verification:** Admin verification pipeline for tax-exempt status (80G / 12A registration).
- [ ] **Push & SMS Notifications:** Web Push Notifications and Twilio SMS alerts for volunteers in the field.
- [ ] **AI-Assisted Listing Creation:** Image recognition model predicting food category and estimated portions from a single photo.
- [ ] **Multi-Node Redis Scaling:** Redis pub/sub adapter for horizontal Socket.IO scaling across container clusters.
- [ ] **Volunteer Route Optimization:** Multi-stop pickup route planning with Google Maps Directions API.

---

## What I Learned

Building AnnaSeva across a structured 10-day engineering sprint provided deep architectural insights into full-stack production design:

1. **Concurrency Requires Atomic Primitives:** High-concurrency bugs cannot be solved with frontend state checks or application-level `if` statements. Protecting shared resources requires pushing synchronization to the database engine using atomic conditional updates.
2. **Defensive API Design is Multi-Layered:** Security is not just JWTs; it requires request body size bounding, edge-proxy IP awareness (`trust proxy`), brute-force throttling with successful-request forgiveness, and automated testing of edge cases.
3. **Real-Time Demands Architectural Discipline:** WebSockets cannot replace the database as the source of truth. Socket events should inform clients of changes; authoritative database queries must confirm them, and reconnect routines must self-heal missed events.
4. **Data Minimization Protects Privacy:** Broadcasting database objects directly creates data leakage. Splitting socket payloads into public sanitary events and private authorized rooms protects sensitive donor and volunteer contact information.

---

## License

This project is licensed under the [MIT License](LICENSE).
