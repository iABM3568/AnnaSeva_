# Architectural Decision Records (ADRs)

## ADR 001: Token Storage Decision (Day 2)

### Context & Problem Statement
In client-server architectures using stateless JWT authentication, the client must store the token across page reloads and include it in subsequent API requests (via the `Authorization: Bearer <token>` header). Where should this token be stored on the client side?

### Options Considered
1. **`localStorage` / `sessionStorage`:**
   - Stored in browser local storage and managed manually via JavaScript.
2. **`httpOnly` Cookies:**
   - Stored in a browser cookie with the `HttpOnly`, `Secure`, and `SameSite` flags enabled, sent automatically by the browser with each request.

### Decision for Current Stage (Day 2 & Day 5 Frontend Integration)
We adopt **`localStorage`** for the initial learning and development implementation.

### Rationale
- **Simplicity:** Extremely straightforward for beginner developers to inspect in browser developer tools (Application tab), test using Thunder Client, and wire up in early React components without complex cross-origin cookie credentials setup.
- **Portability:** Decouples API testing from browser cookie management; Bearer tokens work identically across Postman/Thunder Client, mobile clients, and web frontends.

### Trade-offs & Security Implications
- **XSS Vulnerability (Cross-Site Scripting):** 
  Tokens stored in `localStorage` can be read by any JavaScript running in the same origin. If a third-party npm package or unsanitized user input injects malicious script, the token can be exfiltrated.
- **Why `httpOnly` Cookies are Preferred in Production:**
  `httpOnly` cookies cannot be accessed by client-side JavaScript (`document.cookie`), mitigating the risk of token theft via XSS. However, cookies introduce Cross-Site Request Forgery (CSRF) concerns that require `SameSite` settings or anti-CSRF tokens.

### Future Production Roadmap
Before deploying to production with real donor and NGO data, we will review migrating token delivery to secure `httpOnly` cookies with `SameSite=Strict` or `SameSite=Lax`.



---

## ADR 002: Reference Donor by ObjectId Instead of Embedding (Day 3)

### Context & Problem Statement
Every food listing must be associated with the donor who published it. Should we embed the donor's profile (name, organization, contact info) directly inside each listing document, or reference the donor's `_id` and use Mongoose `populate()` when needed?

### Decision
Store `donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }` as a reference.

### Rationale
- **Single Source of Truth:** If a restaurant or catering partner updates their organization name, address, or phone number, all past and active listings remain immediately accurate without requiring cascading document updates across thousands of listings.
- **Document Size & Write Performance:** Keeps listing documents compact, reducing MongoDB memory footprint and disk I/O.
- **Controlled Information Disclosure:** `populate('donor', 'name organization')` allows us to explicitly pick which donor fields to expose to NGOs, preventing accidental leakage of sensitive donor account details.

### Trade-offs Considered
- **Read Overhead:** Referencing requires an extra query lookup behind the scenes during `populate()`. However, with a target MVP volume of ~1 request every 8 seconds, this overhead is negligible compared to the data integrity advantages.

---

## ADR 003: Expiry Computed Dynamically Instead of Stored as Mutable Status (Day 3)

### Context & Problem Statement
Food has a strict expiration deadline (`expiresAt`). Should the system store an `'expired'` status in the document and use a background cron job to periodically find and update expired food, or compute expiration dynamically at query time?

### Decision
Do **not** store an `'expired'` status. Derive food availability dynamically at query time using `{ expiresAt: { $gt: new Date() } }`.

### Rationale
- **Eliminates Background Schedulers & Latency Gaps:** A cron job running every 5 or 15 minutes creates a "stale window" where expired food is still visible to NGOs before the next cron tick runs. Query-time filtering ensures 100% real-time accuracy based on the server's clock.
- **Operational Simplicity:** Eliminates the architectural complexity and failure modes of background worker processes, distributed cron locks, and Redis queues during early stages.
- **Historical Reporting Integrity:** Listings retain their operational lifecycle state (`available`, `claimed`, `completed`, `cancelled`) without being overwritten by an `'expired'` status, allowing accurate analytics on claim conversion rates and expiration loss.


---

## ADR 004: Atomic Claim State Transition via `findOneAndUpdate` (Day 4)

### Context & Problem Statement
When high-demand surplus food listings appear, multiple NGOs may simultaneously view and click "Claim". If the application reads the listing to check availability (`status === 'available'`) and subsequently issues an update (`listing.save()`), a race condition occurs: between the read and the save, multiple concurrent requests pass the check, resulting in a single listing being double- or triple-claimed by different NGOs.

### Decision
Enforce state transitions using an atomic single-operation query:
```javascript
await Listing.findOneAndUpdate(
  { _id: id, status: 'available', expiresAt: { $gt: new Date() } },
  { status: 'claimed', claimedBy: req.user.id, claimedAt: new Date() },
  { returnDocument: 'after' }
);
```

### Rationale
- **Atomic Concurrency Guarantee:** In MongoDB, document-level updates are atomic. Even under high concurrency (verified via 20 simultaneous requests), the database processes writes sequentially; exactly **one** request matches the `{ status: 'available' }` guard, while the remaining 19 fail to match and receive a `409 Conflict`.
- **Zero Double-Allocation:** Guarantees that an NGO will never travel to collect food that was promised to another organization.
- **Privacy & IDOR Protection:** If an update fails, a scoped existence check (`Listing.exists({ _id, donor: req.user.id })`) returns `404 Not Found` for unauthorized or foreign documents, preventing attackers from confirming the existence of competitor listings.

### Trade-offs Considered
- **Direct Update Bypasses Schema Validations by Default:** `findOneAndUpdate` does not invoke Mongoose document middleware or schema validators unless `{ runValidators: true }` is supplied. Because all update fields (`status: 'claimed'`, `claimedBy`, `claimedAt`) are server-controlled literals, this trade-off is completely safe.

---

## ADR 005: Deploy a Skeleton Early (Day 5)

### Context & Problem Statement
In traditional development workflows, teams often delay deployment until the entire application is finished ("Day 10"). However, production environments differ significantly from local developer machines: strict browser CORS policies, HTTPS enforcement, environment variable baking at build time, SPA routing rewrites, and database network firewalls. Should AnnaSeva delay deployment or deploy an early skeleton on Day 5?

### Decision
Deploy an authenticated baseline skeleton on Day 5:
- **Backend API:** Render Web Service (Node.js/Express)
- **Database:** MongoDB Atlas (Dedicated cloud cluster)
- **Frontend SPA:** Vercel (Vite + React + React Router)

### Rationale
- **Isolates Infrastructure Bugs Early:** If CORS breaks or React Router throws a 404 on page refresh, the surface area of potential causes is tiny (only login/register routes exist).
- **Verifies the Full Deployment Pipeline:** Validates automated builds, Git webhooks, environment variable propagation, and database connectivity.
- **Enables Continuous Delivery:** After Day 5, every subsequent milestone (Day 6 Donor experience, Day 7 NGO claims, Day 8 Real-time websockets) is verified immediately on real mobile phones and browsers simply by pushing to GitHub.

### Trade-offs & Operational Considerations
- **Render Free Tier Cold Starts:** Inactive instances sleep after 15 minutes of inactivity; the initial request may take up to 50 seconds to boot. (Documented for demo scripts).
- **Atlas IP Whitelisting:** Render free-tier instances have dynamic egress IPs, necessitating `0.0.0.0/0` (allow from anywhere) in Atlas Network Access. This is mitigated by enforcing strong randomized database passwords, TLS encryption in transit, and least-privilege user roles.

---

## ADR 006: UI Waits for Server Instead of Guessing Results (Day 6)

### Context & Problem Statement
When a donor triggers a state transition (e.g. clicking "Mark Picked Up" or "Cancel"), the frontend could optimistically update local component state before the server responds to provide instant UI feedback, or wait for the server's HTTP response before mutating local state (*pessimistic updates*). Which approach best suits AnnaSeva's food lifecycle?

### Decision
Adopt **pessimistic UI updates** for all listing state transitions. The component disables action buttons, awaits the server response, and replaces the specific listing with the exact document returned by the database.

### Rationale
- **Zero State Divergence:** In critical food redistribution workflows, showing a listing as "Cancelled" or "Picked Up" when the backend transaction actually failed (e.g., due to an expired deadline or permission conflict) leads to severe real-world confusion.
- **Single Source of Truth:** The server's database engine governs all lifecycle state machines. The client never guesses or synthesizes document states.
- **Clean Error Recovery:** If a mutation fails (e.g. `409 Conflict`), the listing card remains in its true active state on screen, and an immediate feedback notice explains the issue without requiring a rollback mechanism.

### Trade-offs Considered
- **Slight Latency:** The user perceives a brief (~100–200ms) delay while the request completes. This is addressed by showing inline action spinners (`Updating...` / `Cancelling...`) and disabling buttons to prevent duplicate clicks.



---

## ADR 007: NGO Discovery, Client Distance Calculations, and Pre-Claim Privacy Trade-offs (Day 7)

### Context & Problem Statement
The NGO discovery experience introduces geospatial queries, interactive map visualization with Leaflet, distance sorting, and atomic claim execution under network latency. Several key architectural trade-offs require formalization:
1. **Distance Computation:** MongoDB's `$near` operator sorts listings by proximity but does not project the distance value in standard query output. Should we switch to a `$geoNear` aggregation pipeline on the backend, or calculate distance on the client using the Haversine formula?
2. **Coordinate Representation Flip:** MongoDB GeoJSON enforces `[longitude, latitude]`, whereas Leaflet and Google Maps require `[latitude, longitude]`. How do we prevent coordinate flip bugs across map markers, popups, and directions?
3. **Pre-Claim Address Privacy:** Currently, `GET /api/listings/nearby` returns the complete `pickupAddress`. Should physical addresses be visible prior to claiming, or masked until an NGO commits to collection?
4. **Stale Asynchronous Responses:** Rapid user interactions (e.g. changing the radius slider from 2 km to 50 km) launch multiple overlapping HTTP requests. An older request arriving after a newer request could overwrite fresh data with stale results.

### Decisions
1. **Client-Side Distance Calculation via Haversine Formula:**
   We retain the efficient `$near` index scan on the server and compute human-readable distances ("450 m", "3.2 km") client-side using the Haversine formula in [`client/src/utils/geo.js`](file:///Users/iabm3568/AnnaSeva2/client/src/utils/geo.js).
2. **Centralized Coordinate Translation (`listingLatLng`):**
   A single, dedicated utility function performs the `[longitude, latitude]` $\to$ `[latitude, longitude]` swap. No component is permitted to perform inline array indexing for coordinates.
3. **Incremental Request Counter Guard (`latestRequest = useRef(0)`):**
   Every geospatial query increments a reference counter. If the received response does not match the latest counter ID, it is discarded immediately.
4. **Pre-Claim Address Transparency with Planned Masking:**
   For Day 7 MVP, `pickupAddress` remains visible to verified, authenticated NGOs to allow volunteers to assess pickup feasibility before claiming. In Day 9 (Hardening), we will evaluate masking the street address in `getNearby` (showing only neighborhood/city) and revealing full addresses only upon claim success (`claimListing` and `getMyClaims`).

### Rationale
- **Simplicity & Performance:** The Haversine formula is computationally negligible for 10–50 listings (< 1 ms in JavaScript). Keeping standard Mongoose `find().populate()` avoids the complexity of writing and maintaining aggregation pipelines (`$geoNear`) across multiple development iterations.
- **Elimination of Coordinate Swap Bugs:** Having one single helper (`listingLatLng`) guarantees that pins never appear inverted (e.g., in the Indian Ocean instead of Pune).
- **Rock-Solid Race Protection:** `latestRequest` guarantees that rapid slider adjustments or geolocation retries never produce UI flicker or display stale listing subsets.
- **Pragmatic Security:** All endpoints require authenticated NGO sessions (`protect` + `restrictTo('ngo')`). Public unauthorized visitors cannot access listings or pickup addresses.

### Trade-offs Considered
- **Client vs. Server Distance Precision:** Haversine assumes a spherical Earth ($R = 6371\text{ km}$), which differs from WGS84 ellipsoidal distance by < 0.5%. Over local collection distances (2–50 km), this variance is undetectable to users.
- **Pre-Claim Address Exposure:** While convenient for volunteers, donors in sensitive residential areas might prefer address concealment until claiming. This is logged as a prioritized enhancement for the production hardening phase.

---

## ADR 008: Authenticated Real-Time Updates via Socket.IO (Day 8)

### Context & Problem Statement
Prior to Day 8, AnnaSeva operated purely on a request-response HTTP paradigm. When a donor posted surplus food, nearby NGOs could only see it if they manually refreshed the browser or adjusted their search radius slider. Similarly, when an NGO claimed a donation, other NGOs viewing the same listing had no immediate indication that the food was gone until an attempted claim failed with `409 Conflict`. 

Surplus food redistribution is highly time-sensitive: cooked meals spoil quickly, and volunteer drivers need immediate notifications. How should real-time synchronization be architected?

### Options Considered
1. **Short Polling (`setInterval` every 5–10s):**
   - *Pros:* Simple to implement with standard REST endpoints.
   - *Cons:* Wasteful network overhead (hundreds of redundant HTTP requests returning `304 Not Modified` or empty payloads); introduces an artificial 5–10 second delay.
2. **Server-Sent Events (SSE):**
   - *Pros:* Built into browsers over HTTP; lightweight for one-way server-to-client streaming.
   - *Cons:* Strictly unidirectional; requires a separate channel for client acknowledgments; lacks native room multiplexing.
3. **Raw WebSockets:**
   - *Pros:* Bi-directional, minimal TCP packet overhead.
   - *Cons:* Lacks built-in reconnection mechanisms, fallback transports for restricted proxies, and room/channel abstraction.
4. **Socket.IO (WebSocket abstraction with HTTP fallback):**
   - *Pros:* Native room multiplexing (`io.to('ngos')`, `io.to('user:<id>')`), automatic reconnection with backoff, handshake authentication middleware, and fallback to HTTP long-polling if corporate firewalls block WebSockets.
   - *Cons:* Requires matching `socket.io-client` on the frontend; requires separate CORS configuration.

### Decision
Adopt **Socket.IO** with **JWT Handshake Authentication** and **Room Multiplexing**.

### Technical Architecture
1. **Handshake Authentication:**
   Clients transmit their JWT in the connection handshake: `io(url, { auth: { token } })`. Socket middleware intercepts the handshake, verifies the token cryptographically via `process.env.JWT_SECRET`, checks user existence in MongoDB, and stores `{ id, role }` in `socket.data.user`. Unauthenticated connections are rejected before opening the socket.
2. **Room Architecture:**
   - `ngos`: Collective room joined by all authenticated NGO sockets. Receives `listing:new` when a donor posts food.
   - `user:<id>`: Personal private room joined by each authenticated user across all their browser tabs/devices. Receives private status alerts.
3. **Database as the Single Source of Truth:**
   Events are emitted strictly **after** database operations succeed (`await Listing.create(...)`, `await Listing.findOneAndUpdate(...)`). Sockets serve as a speed optimization, not the source of truth.
4. **Data Minimization & Privacy:**
   When an NGO claims food, general NGOs in `ngos` receive a sanitized `listing:updated` event with `claimedBy` stripped out. Only the donor and the claiming NGO receive the full payload.
5. **Reconnection & State Recovery:**
   If a network drop occurs, Socket.IO re-establishes connection automatically. Upon `reconnect`, the client triggers an authoritative REST API re-fetch (`loadNearby()` / `loadListings()`) to ingest any events missed during disconnection.

### Future Multi-Server Scaling (The Redis Adapter)
Currently, AnnaSeva runs on a single server instance. When scaling horizontally across multiple Node.js processes or server instances, an event emitted on Server A does not reach users connected to Server B. The standard solution is the **Socket.IO Redis Streams / Pub-Sub Adapter**, where server instances broadcast events to a central Redis channel that fans out messages to all cluster nodes, coupled with sticky sessions on the load balancer for polling fallbacks. This is documented for future scaling and is not required for the current single-instance deployment.

---

## ADR 009: API Hardening, Rate Limiting, Trust Proxy & Impact Statistics (Day 9)

### Context & Problem Statement
As AnnaSeva moves toward production and public demo readiness, the application surface area must be hardened against common web vulnerabilities (OWASP Top 10):
1. **Unprotected HTTP Headers:** Default Express configurations emit `X-Powered-By: Express` and omit critical browser safety directives.
2. **Brute-Force & Denial of Service Attacks:** Public endpoints (`POST /api/auth/login`, `POST /api/auth/register`) can be overwhelmed by credential-stuffing bots.
3. **Reverse Proxy IP Masking:** Hosted deployments on cloud platforms like Render route inbound traffic through proxy load balancers. Without explicit proxy trust configuration, all visitors appear to share the proxy's IP address.
4. **Oversized Request Payloads:** Clients could transmit megabytes of JSON, exhausting server memory.
5. **Impact Reporting:** Platform-wide metrics must be calculated without compromising donor privacy or introducing heavy server overhead.

### Decisions
1. **Security Headers via Helmet:**
   `helmet()` is applied globally at the top of the middleware stack. It injects defensive headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`) and strips `X-Powered-By`.
2. **Two-Tiered Rate Limiting (`express-rate-limit`):**
   - *General API Limiter (`apiLimiter`):* 1000 requests per 15 minutes per IP (configurable via `RATE_LIMIT_MAX`).
   - *Authentication Limiter (`authLimiter`):* 20 failed login/registration attempts per 15 minutes per IP (`skipSuccessfulRequests: true`).
3. **Payload Clamping (10 KB Limit):**
   `express.json({ limit: '10kb' })` replaces unbounded body parsing, immediately returning HTTP 413 for oversized payloads.
4. **Explicit Trust Proxy Configuration (`app.set('trust proxy', 1)`):**
   Instructs Express to inspect the `X-Forwarded-For` header for the true client IP from Render's edge proxy.
5. **Live Database Aggregation for Statistics:**
   `GET /api/stats` runs an efficient pipeline (`$match: { status: 'completed' }` $\to$ `$group: { _id: null, mealsRescued: { $sum: '$quantity' }, pickups: { $sum: 1 } }`).

### Rationale
- **Targeted Defense:** Stricter limits on failed authentication prevent dictionary attacks while allowing legitimate users to make standard API calls unhindered.
- **Memory-Based Rate Limiting:** Storing counters in memory introduces zero infrastructure dependencies (no Redis required for single-node MVP) while effectively mitigating runaway client loops.
- **Accurate Aggregation:** Running `$group` in MongoDB computes totals directly on disk rather than pulling thousands of documents into Node memory.

### Trade-offs Considered
- **In-Memory Rate Limiting:** Counters reset if the server restarts, and counters are not shared across multi-server horizontal clusters (documented in `docs/scaling-notes.md`).
- **`localStorage` vs. `httpOnly` Cookies:** `localStorage` remains in place for development portability and clean Bearer authorization. Mitigated by strict React input escaping (no `dangerouslySetInnerHTML`) and strict CORS controls.
