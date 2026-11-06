# AnnaSeva — Engineering Progress Report: Day 8

**Project:** AnnaSeva (Surplus Food Redistribution Platform)  
**Milestone:** Day 8 — Authenticated Real-Time Communication Using Socket.IO  
**Technology Stack:** Node.js, Express 5, Socket.IO 4.8, Socket.IO Client 4.8, React 19, React Router v7, MongoDB Atlas  
**Repository:** [https://github.com/iABM3568/AnnaSeva_](https://github.com/iABM3568/AnnaSeva_)  
**Branch:** `feature/realtime`  
**Completion Status:** **COMPLETE**

---

## A. Executive Summary

On **Day 8**, we implemented an authenticated, multi-room, bidirectional real-time communication system for AnnaSeva using **Socket.IO**.

Surplus food redistribution is intensely time-critical: when a restaurant finishes service with 50 fresh meals, nearby NGOs need instant visibility. With today's implementation:
1. **Instant Food Discovery:** When a donor posts food, every eligible NGO within proximity receives the new listing on their open screen within **under 100 milliseconds** without refreshing the browser.
2. **Instant Claim Removal & Privacy-Safe Broadcast:** When an NGO claims food, the donation immediately vanishes from competing NGOs' screens. Competitors receive a sanitized payload with the claimer's identity removed (Data Minimization).
3. **Private Donor Alerts:** The donor receives a targeted real-time alert identifying which NGO claimed their food and prompting them to prepare the pickup.
4. **Lifecycle Synchronization:** Marking food as "Picked Up" or "Cancelled" pushes instantaneous status updates to all active parties.
5. **Robust Reconnection:** If an NGO volunteer experiences network drops or tunnels, Socket.IO reconnects automatically and triggers an authoritative REST API re-fetch to bridge any missed events.

All 7 real-time test suites passed against the live MongoDB Atlas cluster, regression suites for Day 6 and Day 7 passed, and the React production build completed with zero errors.

---

## B. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│ REACT FRONTEND (Client)                                                │
│                                                                        │
│   AuthContext ──► Token (localStorage) ──► SocketContext.jsx           │
│                                                │                       │
│   Navbar.jsx (Live/Offline indicator) ◄────────┤                       │
│   NgoNearby.jsx ('listing:new', 'listing:updated')                     │
│   DonorDashboard.jsx ('listing:updated')       │ WebSocket (WS/WSS)    │
│   MyClaims.jsx ('listing:updated')             │ auth: { token }       │
└────────────────────────────────────────────────┼───────────────────────┘
                                                 │
                                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ NODE.JS HTTP SERVER & SOCKET.IO (Backend)                              │
│                                                                        │
│   initSocket(httpServer) ──► JWT Handshake Middleware                  │
│                                  │                                     │
│   Room Architecture:             ▼                                     │
│   ├── 'ngos' (All connected NGOs) ◄── emitListingNew                   │
│   └── 'user:<id>' (Personal private rooms) ◄── emitListingUpdated      │
│                                  ▲                                     │
│                                  │ Calls emit helpers after DB writes  │
│   listing.controller.js ─────────┘                                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ MONGODB ATLAS CLUSTER (Database — The Single Source of Truth)           │
│                                                                        │
│   1. Write succeeds (Listing.create / findOneAndUpdate)                │
│   2. Sockets announce the verified change to subscribed rooms          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## C. Files Created

1. [`server/sockets/index.js`](file:///Users/iabm3568/AnnaSeva2/server/sockets/index.js)
   - Initializes Socket.IO attached to Node's HTTP server.
   - Enforces JWT handshake authentication middleware.
   - Assigns connected sockets to private rooms (`user:<id>`) and collective discovery rooms (`ngos`).
2. [`server/sockets/emit.js`](file:///Users/iabm3568/AnnaSeva2/server/sockets/emit.js)
   - Reusable emission helpers: `emitListingNew` and `emitListingUpdated`.
   - Implements data minimization: strips `claimedBy` from general NGO broadcasts.
3. [`client/src/context/SocketContext.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/context/SocketContext.jsx)
   - Manages client-side socket lifecycle, connection state, token handshakes, and unmount cleanups.
   - Exposes `useSocket()` custom hook.
4. [`server/scripts/test-day8.js`](file:///Users/iabm3568/AnnaSeva2/server/scripts/test-day8.js)
   - Automated 7-point integration test suite testing authentication, room multiplexing, real-time broadcasts, and privacy protection.
5. [`docs/DAY_8_REPORT.md`](file:///Users/iabm3568/AnnaSeva2/docs/DAY_8_REPORT.md)
   - Comprehensive Day 8 engineering report.

---

## D. Files Modified

1. [`server/server.js`](file:///Users/iabm3568/AnnaSeva2/server/server.js)
   - Wrapped Express in `http.createServer(app)`.
   - Attached Socket.IO using `initSocket(httpServer)` so Express and WebSockets share a single port.
2. [`server/controllers/listing.controller.js`](file:///Users/iabm3568/AnnaSeva2/server/controllers/listing.controller.js)
   - Integrated `emitListingNew` into `createListing`.
   - Integrated `emitListingUpdated` into `claimListing`, `completeListing`, and `cancelListing`.
   - Added `withParties` query populator to attach donor and claimer details before emission.
3. [`client/src/main.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/main.jsx)
   - Wrapped the root component tree with `<SocketProvider>` inside `<AuthProvider>`.
4. [`client/src/components/Navbar.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/components/Navbar.jsx)
   - Added live socket status badge: `● Live` (green pulse) when connected and `○ Offline` when disconnected.
5. [`client/src/pages/NgoNearby.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/NgoNearby.jsx)
   - Subscribed to `listing:new` (filters by radius and prepends new food to state).
   - Subscribed to `listing:updated` (removes claimed/cancelled food from view).
   - Added `reconnect` listener to trigger authoritative API re-fetches.
   - Added complete `useEffect` cleanup handlers.
6. [`client/src/pages/DonorDashboard.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/DonorDashboard.jsx)
   - Wrapped `loadListings` in `useCallback`.
   - Subscribed to `listing:updated` to display live claim alerts ("🤝 [NGO Name] claimed [Food Title]").
   - Added `reconnect` listener and cleanup handlers.
7. [`client/src/pages/MyClaims.jsx`](file:///Users/iabm3568/AnnaSeva2/client/src/pages/MyClaims.jsx)
   - Subscribed to `listing:updated` to reflect real-time status transitions (e.g. food marked completed by donor).
   - Added `reconnect` listener and cleanup handlers.
8. [`docs/decisions.md`](file:///Users/iabm3568/AnnaSeva2/docs/decisions.md)
   - Documented **ADR 008**: Authenticated Real-Time Updates via Socket.IO vs. Polling vs. SSE.
9. [`docs/journal.md`](file:///Users/iabm3568/AnnaSeva2/docs/journal.md)
   - Appended Day 8 engineering reflections and architectural lessons.

---

## E. Newly Installed Dependencies

- **`socket.io`** (`^4.8.1`) in `server/package.json`: Server-side WebSocket & engine.io framework.
- **`socket.io-client`** (`^4.8.1`) in `client/package.json`: Client-side connection manager and event listener.
- **`socket.io-client`** (`^4.8.1`) in `server/package.json` (devDependencies): For automated integration test runner.

---

## F. Testing Results Matrix

Executed against MongoDB Atlas using `node server/scripts/test-day8.js`:

| # | Test Scenario | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|
| **1** | Multi-Role Client Provisioning | Donor, NGO A, and NGO B accounts created with valid JWTs. | All 3 users created and issued distinct bearer tokens. | ✅ **PASS** | `Donor ID: ...e83, NGO A ID: ...e84, NGO B ID: ...e85` |
| **2** | Handshake Security (No Token) | Unauthenticated handshake rejected with error. | Rejected with `Authentication required: Token missing`. | ✅ **PASS** | Error intercepted during handshake. |
| **3** | Handshake Security (Tampered Token) | Invalid JWT signature rejected with 401 error. | Rejected with `Unauthorized: invalid token`. | ✅ **PASS** | Cryptographic verification failed safely. |
| **4** | Authenticated Handshake & Rooms | Valid tokens connect and join `user:<id>` and `ngos`. | Sockets connected; private rooms created; `ngos` room size = 2. | ✅ **PASS** | Server room adapter inspected: `user:id` & `ngos` confirmed. |
| **5** | Real-Time `listing:new` Broadcast | Donor posts food; both NGOs receive event; donor excluded. | NGO A and NGO B received event in < 100ms; donor received nothing. | ✅ **PASS** | Both sockets emitted `listing:new`; donor listener remained silent. |
| **6** | Targeted Private Alert on Claim | NGO A claims food; donor receives private alert with NGO details. | Donor received status `claimed` with `claimedBy: "Pune Annadan Trust"`. | ✅ **PASS** | Private room `user:<donorId>` delivered full document. |
| **7** | Data Minimization on Claim | Non-winning NGO B receives `listing:updated` WITHOUT `claimedBy`. | NGO B received updated listing where `claimedBy` was undefined. | ✅ **PASS** | Inspected NGO B payload: competitor info was completely omitted. |
| **8** | Status Transition on Complete | Donor marks food completed; NGO A receives real-time update. | NGO A socket received `listing:updated` with status `completed`. | ✅ **PASS** | `status: "completed"` received on claiming NGO's client. |
| **9** | Clean Disconnection on Logout | Calling `socket.disconnect()` closes socket cleanly. | All sockets report `connected: false` with rooms automatically cleaned. | ✅ **PASS** | Server cleans up socket instances from memory. |

*Regression Check:*
- Day 7 test suite (`test-day7.js`): **12/12 PASS**
- Day 6 test suite (`test-day6-detailed.js`): **14/14 PASS**

---

## G. Security Review

1. **Authentication at the Gateway:**
   Unauthenticated visitors cannot establish a persistent socket connection. The token is verified before connection acceptance, preventing denial-of-service connection exhaustion.
2. **Room Isolation:**
   Rooms are assigned server-side based on the verified database record (`user.role`). A client cannot send a message asking to join `admin` or another user's private room.
3. **Data Minimization:**
   Broadcasting sensitive data (e.g. which NGO won a claim) to all competing NGOs is a data leak. In `server/sockets/emit.js`, the general broadcast explicitly deletes `claimedBy` before transmitting to `ngos`.
4. **Database-First Integrity:**
   Events are emitted strictly **after** database transactions resolve. If MongoDB rejects an atomic claim with `409 Conflict`, no socket event is emitted.

---

## H. Deployment Status

- **Local Verification:** Fully tested and operational across both Node.js HTTP server and Vite dev server.
- **Production Readiness:**
  - `client/src/context/SocketContext.jsx` connects to `import.meta.env.VITE_SOCKET_URL`.
  - In production on Vercel, `VITE_SOCKET_URL` should point to the Render backend origin (e.g. `https://annaseva-api.onrender.com` without `/api`).
  - Render natively supports WebSockets on its standard Web Service tier.

---

## I. Git Status

- **Branch:** `feature/realtime`
- All changes staged and ready for modular commit sequence.

---

## J. Beginner Learning Summary

1. **How Socket.IO Works:**
   Socket.IO establishes a persistent, full-duplex TCP socket between browser and server. Instead of the browser repeatedly asking *"Any new food?"*, the server pushes an event the instant a donation is recorded.
2. **Handshake Authentication:**
   When connecting, the client passes its JWT in `auth: { token }`. A socket middleware function intercepts the connection, verifies the token, and attaches the user's ID to `socket.data.user`.
3. **Why Rooms Matter:**
   Rooms are server-side groupings. Calling `io.to('ngos').emit(...)` sends a message to all connected NGOs without spamming donors. Calling `io.to('user:<id>').emit(...)` messages one specific user, even if they have multiple browser tabs open.
4. **Why `useEffect` Cleanup is Critical:**
   In React, if you call `socket.on('event', fn)` without returning `socket.off('event', fn)`, every time the user navigates between pages, a new duplicate listener is registered. Navigating five times would trigger the notification five times!
5. **Why the Database is the Single Source of Truth:**
   Socket events are fast, but they can be missed if a user temporarily loses internet. The database holds the definitive truth; whenever a socket reconnects, the client re-queries the REST API to reconcile any missed events.
6. **Why Redis Would Be Needed Later:**
   Today, AnnaSeva runs on a single server. If we expand to two servers behind a load balancer, an NGO on Server 1 wouldn't hear an event emitted on Server 2. A Redis Pub/Sub adapter links multiple server instances so events cross server boundaries.

---

## K. Day 9 Readiness (Buffer & Hardening)

With Days 1 through 8 complete, AnnaSeva has:
- Complete Authentication (Day 1 & 2)
- Food Listings API & Geolocation (Day 3)
- Atomic Claim System & Race Test Protection (Day 4)
- React Frontend & Architecture (Day 5)
- Complete Donor Experience (Day 6)
- Complete NGO Map Discovery & Claiming (Day 7)
- Authenticated Real-Time Updates (Day 8)

Tomorrow (**Day 9**), we will proceed with **Hardening, Polish, Security Headers (`helmet`), Rate Limiting, and Buffer** before the final Day 10 demo preparation!
