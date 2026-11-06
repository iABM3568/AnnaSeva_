# AnnaSeva — Engineering Progress Report: Day 6

**Project:** AnnaSeva (Surplus Food Redistribution Platform)  
**Milestone:** Day 6 — The Donor Experience (Food Posting, Listing Management, and Pickup Coordination)  
**Technology Stack:** React 19, Vite 6, Tailwind CSS v4, React Router v7, Browser Geolocation API, Express 5, MongoDB Atlas  
**Repository:** [https://github.com/iABM3568/AnnaSeva_](https://github.com/iABM3568/AnnaSeva_)  
**Current Branch:** `main` (Synced with GitHub)

---

## Executive Summary

On **Day 6**, we implemented the complete, end-to-end **Donor Experience** in the browser.

Donors can now create surplus food listings with GPS coordinates, track their active listings in real time, observe when an NGO claims their donation, mark claimed food as picked up, or cancel available listings. We also established foundational, reusable UI components (`StatusBadge`, `ListingCard`, `Notice`, `ErrorMessage`, `EmptyState`, and the `useGeolocation` custom hook) that adhere to the industry-standard **Four-States Pattern** (`loading`, `error`, `empty`, and `data`).

All functionality has been verified locally and via automated integration test suites, committed on `feature/donor-ui`, merged into `main`, and pushed to GitHub.

---

## 1. Core Architectural & Frontend Concepts

### 1.1 The Four-States Pattern
Every screen that loads asynchronous data must gracefully handle four distinct states:
1. **Loading:** Immediate visual feedback via animated spinners (`<Loader />`) preventing user confusion while network requests are in flight.
2. **Error:** Clear, actionable error messaging with an interactive `<ErrorMessage onRetry={...} />` button to recover from transient network drops.
3. **Empty:** Rather than displaying a blank void, `<EmptyState />` explains that no donations currently exist and provides a prominent call to action ("Post Your First Listing").
4. **Data:** The populated grid displaying active donations and historical archives.

### 1.2 Stable React Keys & DOM Reconciliation
When rendering dynamic lists (`listings.map(...)`), each item is keyed by its unique database identifier (`key={listing._id}`). Using array indices is avoided because as listings are completed or cancelled, indices shift, which causes React's reconciliation engine to misidentify elements and produce visual rendering bugs.

### 1.3 Pessimistic UI Updates (ADR 006)
* **The Rule:** The server's database engine is the single source of truth.
* **The Mechanism:** When a donor clicks "Mark Picked Up" or "Cancel", the UI does not optimistically guess the outcome. It disables the button, displays an inline progress state (`Updating...`), awaits the HTTP `PATCH` response, and updates the state array using the exact listing document returned by MongoDB:
  ```javascript
  setListings((prev) => prev.map((item) => (item._id === id ? updatedListing : item)));
  ```
* **Why it matters:** If an action fails (e.g. food expired or listing was cancelled elsewhere), the UI never shows a false success state.

### 1.4 Browser Geolocation API & `useGeolocation` Custom Hook
Surplus food redistribution requires precise physical locations for NGO discovery. We abstracted `navigator.geolocation.getCurrentPosition` into a custom hook:
* Manages `coords` (`{ lat, lng }`), `loading`, `error`, and `locate`.
* Provides a manual latitude/longitude input fallback for desktop browsers or users who deny location permissions.

### 1.5 Date & Timezone Discipline
HTML `<input type="datetime-local">` outputs an unzoned local string (e.g. `2026-11-06T18:30`).
* **Rule:** Store and send in UTC; display in user's local time.
* Before sending to the server, the string is converted to UTC ISO 8601 (`new Date(val).toISOString()`).
* When rendered on cards, it is formatted to the viewer's local clock using `toLocaleDateString()` and annotated with a human-friendly countdown (`timeLeft()`).

### 1.6 Derived State
"Expired" is not stored as a mutable database status. Instead, `displayStatus(listing)` dynamically computes whether an `available` listing has passed its `expiresAt` deadline at render time.

---

## 2. Components Created & Enhanced

| Component / Utility | File Path | Purpose |
|---|---|---|
| **Format Helpers** | [`client/src/utils/format.js`](file:///Users/iabm3568/AnnaSeva2/client/src/utils/format.js) | Standardizes datetime strings, computes time remaining (`timeLeft`), and derives `displayStatus`. |
| **Status Badge** | [`client/src/components/StatusBadge.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/StatusBadge.jsx) | Color-coded status pills (`available`, `claimed`, `completed`, `cancelled`, `expired`). |
| **Notice Alert** | [`client/src/components/Notice.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/Notice.jsx) | Dismissible feedback alert for successful operations. |
| **Error Message** | [`client/src/components/ErrorMessage.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/ErrorMessage.jsx) | Semantic alert with retry action trigger. |
| **Empty State** | [`client/src/components/EmptyState.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/EmptyState.jsx) | Friendly zero-data illustration and call-to-action button. |
| **Listing Card** | [`client/src/components/ListingCard.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/ListingCard.jsx) | Displays food attributes, expiry countdown, claiming NGO details, and dynamic action buttons. |
| **Geolocation Hook** | [`client/src/hooks/useGeolocation.js`](file:///Users/iabm3568/AnnaSeva2/client/src/hooks/useGeolocation.js) | Reusable hook encapsulating browser GPS positioning and error handling. |
| **New Listing Page** | [`client/src/pages/NewListing.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/NewListing.jsx) | Food donation publishing form with GPS coordinate acquisition. |
| **Donor Dashboard** | [`client/src/pages/DonorDashboard.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/DonorDashboard.jsx) | Full donor dashboard implementing the four-states pattern, active/history sections, and pickup/cancel actions. |
| **Role-Aware Navbar** | [`client/src/components/Navbar.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/Navbar.jsx) | Displays "+ Post Food" and "My Listings" for donors, and "Find Food" for NGOs. |

---

## 3. Integration & Lifecycle Test Results

### Automated Integration Suite (`server/scripts/test-day6.js`)

All 10 integration scenarios passed cleanly against MongoDB Atlas:

```text
--- DAY 6 DONOR EXPERIENCE INTEGRATION TEST SUITE ---
✅ Connected to MongoDB: annaseva_dev
✅ Test server running on http://127.0.0.1:52732
Test 1  - Register Donor:                            ✅ PASS (201 Created)
Test 2  - Register NGO:                              ✅ PASS (201 Created)
Test 3  - Donor Posts Listing 1:                     ✅ PASS (201 Created)
Test 4  - Donor Sees Posted Listing in /mine:        ✅ PASS (200 OK) (Count: 1)
Test 5  - NGO Claims Listing 1:                      ✅ PASS (200 OK)
Test 6  - Claim Details Populated in Donor /mine:    ✅ PASS (ClaimedBy: Day6 Food Care NGO)
Test 7  - Donor Marks Listing Picked Up (Complete):  ✅ PASS (200 OK)
Test 8  - Donor Cancels Listing 2:                   ✅ PASS (200 OK)
Test 9  - NGO Forbidden from Posting Food:           ✅ PASS (403 Forbidden)
Test 10 - NGO Forbidden from Marking Complete:       ✅ PASS (403 Forbidden)
--- ALL DAY 6 DONOR EXPERIENCE TESTS PASSED ---
```

### Production Build Verification
Executed `npm run build` in `/client`:
```text
vite v6.4.5 building for production...
✓ 116 modules transformed.
dist/index.html                   0.47 kB │ gzip:   0.32 kB
dist/assets/index-BVIGLDME.css   20.23 kB │ gzip:   4.76 kB
dist/assets/index-BuWyDt9h.js   357.37 kB │ gzip: 113.25 kB
✓ built in 751ms
```
Zero compilation errors or bundle warnings.

---

## 4. Architectural Decision Records (ADRs)

Added **ADR 006** to [`docs/decisions.md`](file:///Users/iabm3568/AnnaSeva2/docs/decisions.md#adr-006-ui-waits-for-server-instead-of-guessing-results-day-6):
* **Decision:** Adopt pessimistic UI updates for listing mutations.
* **Impact:** Guarantees that client state strictly mirrors database reality. Prevents ghost state where an action appears successful in the browser despite failing on the server.

---

## 5. Day 6 Completion Status

| Feature | Status | Verification Detail |
|---|---|---|
| Food Listing Creation Form | **COMPLETED** | Controlled inputs, GPS coordinates, UTC conversion, Zod compliance |
| Browser Geolocation Integration | **COMPLETED** | `useGeolocation` custom hook with manual lat/lng fallback |
| Donor Dashboard (Four-States) | **COMPLETED** | Loading, error with retry, empty state, and populated data views |
| Listing Cards & Status Badges | **COMPLETED** | Reusable components displaying meals, expiry countdown, and claim info |
| Pickup Completion Workflow | **COMPLETED** | `PATCH /api/listings/:id/complete` verified via UI and test script |
| Listing Cancellation Workflow | **COMPLETED** | `PATCH /api/listings/:id/cancel` verified with confirmation dialog |
| Role-Aware Navigation Header | **COMPLETED** | Dynamic navigation links matching authenticated user role |
| Integration Testing | **COMPLETED** | 10/10 automated tests passing |
| Production Build | **COMPLETED** | Vite compiles in 751ms |
| Documentation & ADR 006 | **COMPLETED** | `docs/decisions.md`, `docs/journal.md`, `docs/DAY_6_REPORT.md` updated |
| Git Commits, Merge & Push | **COMPLETED** | Merged into `main` and pushed to GitHub |

---

## 6. Readiness for Day 7

With the Donor experience fully operational, we are ready for **Day 7: The NGO Experience (Map and Claim)**!
* Interactive Leaflet / Mapbox map showing nearby surplus food.
* Radius filter slider (1 km – 20 km).
* One-click claiming with atomic concurrency safeguards.
* NGO Claims management view (`/ngo/claims`).
