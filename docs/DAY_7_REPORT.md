# AnnaSeva — Engineering Progress Report: Day 7

**Project:** AnnaSeva (Surplus Food Redistribution Platform)  
**Milestone:** Day 7 — The Complete NGO Experience (Interactive Map, Discovery, Atomic Claiming & Navigation)  
**Technology Stack:** React 19, Leaflet 1.9, React-Leaflet 5.0, Vite 6, Tailwind CSS v4, React Router v7, Express 5, MongoDB Atlas  
**Repository:** [https://github.com/iABM3568/AnnaSeva_](https://github.com/iABM3568/AnnaSeva_)  
**Branch:** `feature/ngo-ui`  
**Completion Status:** **COMPLETE**

---

## Executive Summary

On **Day 7**, we designed, implemented, and verified the complete **NGO Discovery & Food Claiming Experience**.

An authenticated NGO volunteer can now:
1. Automatically detect their physical location using the browser Geolocation API, or click anywhere on an interactive OpenStreetMap to relocate their search center.
2. Dynamically adjust their search radius (2 km, 5 km, 10 km, 25 km, 50 km) with full protection against stale async response races.
3. Discover available surplus food donations plotted on an interactive Leaflet map and displayed in a synchronized list view sorted by proximity.
4. View real-time Haversine distances ("450 m away", "3.2 km away") calculated client-side.
5. Atomically claim food donations with pessimistic UI updates. If another NGO claims the food first, the application gracefully handles the `HTTP 409 Conflict` by removing the card and alerting the volunteer.
6. Open **My Claims** (`/ngo/claims`) to review all food items claimed by their organization, complete with donor organization details, pickup addresses, and a one-click **Get Directions** link to Google Maps (`target="_blank" rel="noopener noreferrer"`).

All 12 automated integration tests passed against the live MongoDB Atlas cluster, regression tests for Day 6 passed, and the React client builds cleanly with zero errors.

---

## 1. Files Created and Modified

| File Path | Type | Responsibility |
|---|---|---|
| [`client/src/leafletSetup.js`](file:///Users/iabm3568/AnnaSeva2/client/src/leafletSetup.js) | Created | Loads Leaflet CSS and resolves Vite production chunk hashing for marker pin assets. |
| [`client/src/utils/geo.js`](file:///Users/iabm3568/AnnaSeva2/client/src/utils/geo.js) | Created | Centralizes the Haversine distance formula (`distanceKm`), single coordinate swap (`listingLatLng`), and distance string formatting. |
| [`client/src/components/ListingMap.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/ListingMap.jsx) | Created | Declarative Leaflet map with OpenStreetMap tiles, recenter viewport sync, search radius circle, user position dot, and marker popups. |
| [`client/src/pages/NgoNearby.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/NgoNearby.jsx) | Created / Replaced | NGO food discovery dashboard with geolocation detection, stale-request protection (`useRef`), radius filtering, and atomic claim handling. |
| [`client/src/pages/MyClaims.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/MyClaims.jsx) | Created | Displays claimed food history with donor details, pickup locations, and external Google Maps turn-by-turn navigation links. |
| [`client/src/App.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/App.jsx) | Modified | Mounted `/ngo/claims` route wrapped in `<ProtectedRoute role="ngo">`. |
| [`server/scripts/seed.js`](file:///Users/iabm3568/AnnaSeva2/server/scripts/seed.js) | Modified | Normalized dotenv path to permit cross-directory execution and seeded 15 demo listings in Pune. |
| [`server/scripts/test-day7.js`](file:///Users/iabm3568/AnnaSeva2/server/scripts/test-day7.js) | Created | 12-suite automated test matrix verifying geospatial queries, atomic claims, race conditions, role protection, and directions. |
| [`docs/decisions.md`](file:///Users/iabm3568/AnnaSeva2/docs/decisions.md) | Modified | Logged **ADR 007**: Client distance calculation, coordinate inversion, and pre-claim privacy trade-offs. |
| [`docs/journal.md`](file:///Users/iabm3568/AnnaSeva2/docs/journal.md) | Modified | Appended Day 7 engineering reflections and architectural takeaways. |

---

## 2. Core Architectural Concepts & Solutions

### 2.1 The Coordinate Flip Trap (MongoDB GeoJSON vs. Leaflet)
One of the most notorious traps in web GIS development is mismatched coordinate ordering:
* **MongoDB GeoJSON Standard:** Coordinates are stored as `[longitude, latitude]` (following the standard Cartesian $(X, Y)$ coordinate plane).
* **Leaflet & Mapping APIs:** Map components require `[latitude, longitude]` (following the navigational $(Y, X)$ order).

If an application inverts coordinates incorrectly, markers will be plotted in the Indian Ocean or on an entirely different hemisphere.

**Our Architectural Rule:**
We strictly prohibit inline coordinate flipping across React components. Instead, all coordinate translations are centralized inside [`client/src/utils/geo.js`](file:///Users/iabm3568/AnnaSeva2/client/src/utils/geo.js):
```javascript
export function listingLatLng(listing) {
  const [lng, lat] = listing.location.coordinates;
  return [lat, lng];
}
```
Components simply call `position={listingLatLng(listing)}`.

---

### 2.2 Resolving the Vite Leaflet Marker Bundling Bug
By default, Leaflet dynamically determines marker icon paths relative to its own script location. When Vite bundles client assets for production, it renames files with content hashes (e.g. `marker-icon-CrXuemCf.png`). As a result, default pins become broken images.

In [`client/src/leafletSetup.js`](file:///Users/iabm3568/AnnaSeva2/client/src/leafletSetup.js), we explicitly import the asset images so Vite bundles them, and then reassign Leaflet's default prototype:
```javascript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

---

### 2.3 Spherical Geometry via Haversine Formula
Because the Earth is a curved sphere rather than a flat plane, Pythagorean calculations produce major distortions. We implemented the **Haversine formula** on the client to determine straight-line great-circle distance:
$$\Delta\text{lat} = \text{lat}_2 - \text{lat}_1, \quad \Delta\text{lng} = \text{lng}_2 - \text{lng}_1$$
$$a = \sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lng}}{2}\right)$$
$$d = 2 \cdot R \cdot \arcsin\left(\sqrt{a}\right) \quad (R = 6371\text{ km})$$

The backend sorts results by proximity using MongoDB's `$near` 2dsphere index. The client computes the precise distance for user-friendly UI display ("450 m away", "3.2 km away").

---

### 2.4 Stale Asynchronous Response Mitigation (`latestRequest`)
When an NGO volunteer rapidly adjusts the radius dropdown (e.g. 2 km $\to$ 10 km $\to$ 50 km) or moves the map pin, multiple network requests are launched concurrently. In asynchronous networks, an older request (e.g. 2 km) might take longer to process and arrive *after* the newer 50 km request. If unchecked, the older response would overwrite the newer response, leaving the user with an incorrect list of donations.

We prevent this by tracking a request counter via `useRef`:
```javascript
const latestRequest = useRef(0);

const loadNearby = useCallback(async () => {
  if (!center) return;
  const requestId = ++latestRequest.current;
  setLoading(true);

  try {
    const { data } = await api.get('/listings/nearby', { params: { lat: center.lat, lng: center.lng, radiusKm } });
    // If a newer request was dispatched while this request was in flight, discard this result:
    if (requestId !== latestRequest.current) return;
    setListings(data.listings || []);
  } finally {
    if (requestId === latestRequest.current) setLoading(false);
  }
}, [center, radiusKm]);
```

---

### 2.5 Pessimistic Atomic Claiming & Graceful 409 Conflict Recovery
Claiming food on AnnaSeva is a competitive operation: multiple volunteer organizations might attempt to claim the same high-demand donation simultaneously.

* **Pessimistic UI Policy (ADR 006):** The UI never optimistically presumes victory. The claim button transitions into a `Claiming...` state and awaits the server's response.
* **HTTP 200 OK (Winner):** The winning NGO receives the listing document with status `claimed` and the full pickup instructions. The card is removed from available listings and a success notification instructs the volunteer to coordinate collection.
* **HTTP 409 Conflict (Lost/Expired):** Another NGO was faster by a few milliseconds. Instead of an unhandled crash or frozen button, the UI recognizes 409 as an expected state machine outcome: it removes the listing card and displays a polite explanation: *"This listing was already claimed or has expired."*

---

## 3. Privacy & Security Review (Pickup Address Analysis)

In Phase 8, we conducted a security audit of listing address visibility:
1. **Current State:** `GET /api/listings/nearby` returns the complete `pickupAddress` on every available listing. All authenticated NGOs can see the exact street address before claiming.
2. **Security Guarantee:** All listing discovery and claim endpoints are protected by `protect` and `restrictTo('ngo')`. Unauthenticated public visitors or general donors cannot discover listings or read pickup addresses.
3. **Privacy Trade-off (ADR 007):** For corporate donors or restaurant partners, pre-claim visibility is helpful because it allows volunteers to confirm they have logistical transport to that neighborhood. However, for residential donors, exposing full street numbers before a claim commitment represents a privacy consideration.
4. **Planned Roadmap (Day 9 Hardening):**
   - Provide an optional `approximateArea` field (e.g. "Kothrud, Pune") for public/pre-claim discovery.
   - Project `pickupAddress: 0` in `getNearby`, revealing full street directions only upon successful claim transition via `PATCH /api/listings/:id/claim` and `GET /api/listings/claimed`.

---

## 4. REST API Integration Table

| Method | Endpoint | Authorized Role | Frontend Consumer | Purpose |
|---|---|---|---|---|
| `GET` | `/api/listings/nearby?lat=...&lng=...&radiusKm=...` | `ngo` | [`NgoNearby.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/NgoNearby.jsx) | Geospatial 2dsphere proximity search for unexpired available donations within radius. |
| `PATCH` | `/api/listings/:id/claim` | `ngo` | [`NgoNearby.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/NgoNearby.jsx) | Atomic state transition from `available` $\to$ `claimed`. Returns 200 OK or 409 Conflict. |
| `GET` | `/api/listings/claimed` | `ngo` | [`MyClaims.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/MyClaims.jsx) | Retrieves all food items claimed by the logged-in NGO, populated with donor details. |
| `GET` | `/api/listings/mine` | `donor` | [`DonorDashboard.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/DonorDashboard.jsx) | Donor observes claimed donations with populated claiming NGO name & organization. |

---

## 5. Comprehensive Verification Matrix (12/12 Suites Passed)

Automated verification was executed against the live database using `node server/scripts/test-day7.js`:

| # | Test Suite | Description | Verified Result | Status |
|---|---|---|---|---|
| **1** | Math & Geo Helpers | Haversine distance, coordinate flip, and distance string formatting. | Pune-Mumbai = 120.2 km; [lng, lat] $\to$ [lat, lng] flip verified. | ✅ **PASS** |
| **2** | Dual NGO Authentication | Register & login two separate NGO accounts and one donor account. | Tokens issued, user roles verified, organizations stored. | ✅ **PASS** |
| **3** | Donor Food Posting | Create 2 specific listings at known Pune locations (Deccan & Shivajinagar). | Listings created with status `available` and valid GeoJSON points. | ✅ **PASS** |
| **4** | Nearby Geospatial Search | NGO 1 searches with 10 km radius at Pune center (18.5204, 73.8567). | Returns 18 available listings sorted by proximity; targets present. | ✅ **PASS** |
| **5** | Radius Boundary Filter | Compare 2 km radius query vs. 15 km radius query. | 2 km returns 2 listings; 15 km returns 18 listings ($2 \le 18$). | ✅ **PASS** |
| **6** | Atomic Claim Operation | NGO 1 claims Listing 1 via `PATCH /api/listings/:id/claim`. | 200 OK; status transitions to `claimed`; `claimedBy` attached. | ✅ **PASS** |
| **7** | Search Exclusion Check | Re-query nearby listings after claim. | Listing 1 is automatically omitted from available results. | ✅ **PASS** |
| **8** | Concurrency Conflict (409) | NGO 2 attempts to claim Listing 1 after it was claimed by NGO 1. | Server rejects with HTTP 409 Conflict: *"already claimed or expired"*. | ✅ **PASS** |
| **9** | Simultaneous Race Test | NGO 1 and NGO 2 claim Listing 2 simultaneously via `Promise.all`. | Exactly **one** 200 OK and **one** 409 Conflict returned. | ✅ **PASS** |
| **10** | My Claims & Directions | NGO 1 requests `/api/listings/claimed`. | 2 claims returned; Google Maps turn-by-turn URL generated. | ✅ **PASS** |
| **11** | Donor Reflection | Donor requests `/api/listings/mine`. | Shows status `claimed` with populated claiming NGO name & org. | ✅ **PASS** |
| **12** | Role Authorization Guard | Donor attempts to call NGO-restricted endpoints. | Server strictly rejects with HTTP 403 Forbidden. | ✅ **PASS** |

In addition, Day 6's 14-point regression suite (`test-day6-detailed.js`) was run and achieved **14/14 PASS**.

---

## 6. Beginner Explain-Back (MERN Mentor Guide)

When speaking to a technical interviewer or mentor, explain Day 7 as follows:

1. **How does web mapping work?**
   > *"A web map is a grid of 256x256 pixel image tiles loaded from an OpenStreetMap server. Leaflet is the engine that calculates which tiles to download, stitches them together, handles drag and zoom physics, and renders HTML/SVG markers on top. React-Leaflet simply wraps those Leaflet controls in declarative React components."*

2. **Why does coordinate order flip?**
   > *"MongoDB adheres to the GeoJSON geographic standard, which uses $(X, Y)$ order: `[longitude, latitude]`. However, Leaflet, Google Maps, and navigation systems follow standard $(Y, X)$ order: `[latitude, longitude]`. If you mix them up, a restaurant in Pune will plot in the middle of the Indian Ocean. We fixed this permanently by writing a single converter helper (`listingLatLng`) and forbidding manual array index flipping in components."*

3. **Why did we use Haversine instead of Pythagoras?**
   > *"The Earth is curved, not flat. Over several kilometers, Euclidean distance ($a^2 + b^2 = c^2$) gives false answers because longitude lines converge as you move away from the equator. The Haversine formula uses spherical trigonometry to compute the real great-circle distance across the Earth's radius ($6371\text{ km}$)."*

4. **What is a stale async response and how does `useRef` fix it?**
   > *"If a user changes the radius from 2 km to 50 km in quick succession, two asynchronous HTTP requests are sent to Express. If the 2 km request finishes last, it would overwrite the 50 km results with older data. By assigning an incrementing counter using `useRef(0)`, the component ignores any network response whose ID doesn't match the latest request."*

5. **Why do we use pessimistic updates for food claiming?**
   > *"Food donation is competitive. If five NGOs tap 'Claim' on the same batch of food, four will be rejected by MongoDB's atomic `findOneAndUpdate` filter. If our React UI optimistically pretended we won before asking the server, the volunteer might start driving to a donor only to find the food was given to another charity. We wait for the server's HTTP 200 confirmation, and if an HTTP 409 returns, we gracefully explain that another NGO claimed it first and remove the card."*
