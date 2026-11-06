# AnnaSeva Engineering Journal

## Day 1: Foundations, Architecture & First Server

### 1. Concepts Learned & Solidified
- **Client vs. Server:** The client is the user-facing customer ordering at a table (browser/mobile); the server is the kitchen staff waiting at a specific port door for incoming orders.
- **Node.js & Express:** Node.js executes JavaScript on the server machine outside the browser; Express provides a lightweight, battle-tested framework for HTTP routing, middleware processing, and response management.
- **HTTP Lifecycle & Verbs:** Every HTTP exchange is a stateless Request (`req`) and Response (`res`). `GET` retrieves state without side effects; `POST` transmits payloads to create or update state.
- **Middleware Pipeline:** Middleware functions execute sequentially in the request lifecycle. `express.json()` reads raw streaming request bodies, parses valid JSON, and hydrates `req.body`.
- **Environment Isolation:** Secrets and infrastructure variables are maintained in `.env` (ignored by Git) and mirrored in `.env.example` with sanitized template values.
- **Separation of App and Server:** Decoupling `app.js` (application definition and route configuration) from `server.js` (environment initialization, database connection, and port binding) enables deterministic unit testing without opening open network sockets.

---

### 2. Architectural Decisions Made Today

| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **ES Modules (`"type": "module"`)** | Native ECMAScript standard (`import`/`export`), clean top-level `await`, modern ecosystem alignment. | Older CommonJS (`require()`) tutorials require minor syntax mental translation. |
| **Separating `app.js` and `server.js`** | Allows integration testing (e.g. Supertest) without starting the HTTP listener; allows future WebSocket (Socket.IO) attachment to the HTTP server instance. | Adds an extra file compared to monolithic single-file beginner tutorials. |
| **Fail-fast Database Bootstrapping** | If `connectDB()` fails to connect to MongoDB, the process calls `process.exit(1)` immediately rather than running as a broken zombie service. | Server will not stay alive if DB is down, which is intentional for a database-dependent API. |
| **Strict `.gitignore` with `!.env.example`** | Protects sensitive credentials from accidental commits while ensuring new collaborators know exactly what environment variables are required. | Developers must remember to manually create their local `.env`. |

---

### 3. Problems Encountered & Resolutions

- **Issue:** Running `node server.js` before configuring MongoDB Atlas produced `MongoDB connection failed: querySrv ECONNREFUSED`.
- **Resolution:** This is intentional fail-fast architecture. Verified that `process.exit(1)` halted execution safely with clear diagnostic logging.
- **Issue:** Preventing `.env` from being accidentally committed while ensuring team visibility into required keys.
- **Resolution:** Authored root `.gitignore` with `.env` and `.env.*` excluded, followed by `!.env.example` on a distinct line without inline comments. Verified via `git status -u`.

---

### 4. Self-Assessment Q&A (Day 1 Check-In)

#### Q1: What is the difference between a client and a server?
*Your Notes:*

#### Q2: What is GET, and how is it different from POST?
*Your Notes:*

#### Q3: What is the difference between status 404, 401 and 500?
*Your Notes:*

#### Q4: Why do we use .env and .env.example?
*Your Notes:*

#### Q5: What does express.json() do, and what breaks without it?
*Your Notes:*

#### Q6: Why do we load dotenv before accessing environment variables?
*Your Notes:*

#### Q7: What is the difference between an Atlas account and a database user?
*Your Notes:*

#### Q8: Why do we use a separate development database (e.g., annaseva_dev)?
*Your Notes:*

#### Q9: What is node_modules, and why don't we commit it to Git?
*Your Notes:*



---

## Day 2: Users, Authentication & Authorization

### 1. Concepts Learned & Solidified
- **Password Hashing with Bcrypt:** Plaintext passwords must never touch database storage. Bcrypt combines salting with adaptive cost factors (cost 12 = 4096 rounds) to prevent rainbow table and brute-force attacks.
- **Mongoose Hooks & Instance Methods:** Pre-save hooks automatically hash passwords when `this.isModified('password')` evaluates to true. Document methods (`comparePassword`) encapsulate credential validation directly on the model.
- **Multi-layered Validation:** Zod enforces schema constraints at the API entrance (`validate` middleware); Mongoose enforces schema integrity at the database layer.
- **Mass Assignment Prevention:** Using `req.valid` instead of `req.body` prevents clients from injecting unauthorized attributes (e.g., `isAdmin: true` or malicious role assignments).
- **Stateless Authentication (JWT):** A signed JSON Web Token carries identity claims (`id`, `role`) cryptographically verified by the server using `JWT_SECRET` without requiring server-side session storage.
- **Middleware Guard Execution Order:** Authentication (`protect`) verifies *who the user is*; Authorization (`restrictTo`) enforces *what the user can do*. `protect` must strictly precede `restrictTo`.
- **Centralized Error Architecture:** Express 5 automatically bubbles async rejections into the 4-argument error-handling middleware, formatting syntax errors, Mongoose validations, duplicate keys, and internal faults into consistent JSON.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **`select: false` on password** | Eliminates accidental password leakage in queries. | Requires explicit `.select('+password')` in login controller. |
| **`req.valid` pattern** | Guarantees controller logic only operates on verified and sanitized data. | Requires accessing `req.valid` instead of standard `req.body`. |
| **Generic 401 response for login** | Prevents user enumeration attacks (attacker cannot distinguish between bad email vs bad password). | Slightly less descriptive feedback for legitimate forgetful users. |
| **Bearer token in `localStorage` (ADR 001)** | Easiest starting point for beginner developer frontend integration. | Vulnerable to XSS compared to `httpOnly` cookies; scheduled for production hardening. |


---

## Day 3: Listings & Geospatial API

### 1. Concepts Learned & Solidified
- **GeoJSON Standard:** Coordinates are stored as `[longitude, latitude]` (East/West first, then North/South). Inverting them places geographic coordinates in the wrong hemisphere or ocean.
- **Spherical Geometry & `2dsphere` Index:** A `2dsphere` index computes distances across the curved surface of the Earth using the WGS84 datum. Without this index, MongoDB immediately rejects `$near` queries.
- **Database-Driven Geospatial Filtering:** Using `$near` and `$maxDistance` (in meters) sorts search results from nearest to farthest directly in the database engine, avoiding in-memory JavaScript sorting.
- **Computed Expiry:** Food freshness is computed on-the-fly (`expiresAt > new Date()`) rather than mutated by scheduled background cron jobs.
- **IDOR Defense (Insecure Direct Object Reference):** Resource ownership is strictly enforced in database filters (`{ donor: req.user.id }`), preventing users from accessing or modifying resources belonging to other accounts.
- **Performance Optimization with `.lean()`:** Omitting Mongoose document hydration for read-only nearby queries provides higher throughput and lower memory consumption.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Referencing Donor by ObjectId (ADR 002)** | Single source of truth. Updates to donor profiles reflect across all listings automatically. | Requires explicit `populate()` query lookup when reading donor details. |
| **Dynamic Computed Expiry (ADR 003)** | 100% real-time accuracy based on server clock without cron delays or worker thread overhead. | Cannot index a dynamically changing date inequality without querying on `expiresAt`. |
| **Max 24-Hour Listing Window** | Enforces food safety policy — cooked surplus food spoils rapidly. | Long shelf-life non-perishables (canned goods) cannot be listed for multiple days (future feature). |
| **`limit(50)` on Nearby Search** | Defends against unbounded result sets and Denial of Service. | NGOs must use smaller search radii if more than 50 listings exist in their area. |


---

## Day 4: The Claim System & System-Design Lab

### 1. Concepts Learned & Solidified
- **Race Conditions:** Occur when system behavior depends on the uncontrollable timing of concurrent operations. The classic "check-then-update" bug allows multiple clients to read `available` and subsequently claim the same single resource.
- **Atomic Operations in MongoDB:** `findOneAndUpdate` performs matching and updating as an indivisible operation at the document level. Concurrent requests are evaluated sequentially; once the first request updates `status` to `'claimed'`, all competing requests fail to match the query guard and receive a clean `409 Conflict`.
- **Status State Machine & Transitions:**
  - `available` $\to$ `claimed` (by NGO)
  - `claimed` $\to$ `completed` (by Donor upon physical pickup)
  - `available` or `claimed` $\to$ `cancelled` (by Donor if plans change)
  - `completed` and `cancelled` are terminal states (no further transitions permitted).
- **Status Code Precision (404 vs 409 vs 403 vs 400):**
  - `400 Bad Request`: Malformed or syntactically invalid input (caught by `validateId`).
  - `401 Unauthorized`: Missing, expired, or invalid JWT token.
  - `403 Forbidden`: Authenticated user lacks role permissions (e.g., Donor attempting to call `PATCH /claim`).
  - `404 Not Found`: Listing does not exist, or does not belong to the calling donor (prevents IDOR existence leakage).
  - `409 Conflict`: Listing exists, but its current state prevents the requested transition (e.g. already claimed or completed).
- **Execution Plans & Index Profiling:**
  - `IXSCAN` (Index Scan): The query engine traverses the B-tree index, examining only the documents that match the target key.
  - `COLLSCAN` (Collection Scan): The database reads every single document in the collection.
  - In our benchmark lab: Searching without an index examined 3,016 documents to return 15; searching with `{ donor: 1, createdAt: -1 }` examined exactly 15 documents.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Atomic `findOneAndUpdate` (ADR 004)** | Eliminates race conditions with zero external locking mechanisms or distributed mutexes. | Direct updates skip Mongoose schema validators (safe here since update fields are server literals). |
| **Silent 404 on Foreign Resource Updates** | Prevents competitors from confirming whether a private listing exists. | Callers get generic "Not Found" instead of specific "Not Your Listing". |
| **Development Seeding Utility (`seed.js`)** | Generates realistic, geographically dispersed listings with known demo accounts for testing. | Must be guarded against running on production databases (`_dev` suffix check). |

---

## Day 5: React Frontend, Authentication & First Deployment

### 1. Concepts Learned & Solidified
- **Single Page Applications (SPAs):** The browser loads `index.html` and bundled JavaScript once. React dynamically swaps page components into the DOM via React Router without triggering full-page browser reloads.
- **Props vs. State:** Props are immutable inputs passed down from parent components (read-only); State is internal component memory (`useState`) that automatically triggers a re-render when modified.
- **React Context (`AuthContext`):** Replaces cumbersome multi-level prop drilling with a centralized shared store for `user`, `loading`, `login()`, `register()`, and `logout()`.
- **Session Persistence Lifecycle:**
  1. On login/register, the JWT token and safe user object are saved to `localStorage`.
  2. On page reload, the client initializes with cached credentials so the UI doesn't flicker.
  3. `useEffect` immediately fires a background verification call to `GET /api/auth/me` using the Axios interceptor.
  4. If the token is valid, the user state is re-confirmed. If invalid or expired, the session is cleared cleanly and the user is redirected to `/login`.
- **Axios Interceptors:** A unified middleware pipeline for frontend HTTP calls:
  - *Request Interceptor:* Automatically attaches `Authorization: Bearer <token>` to every outgoing request.
  - *Response Interceptor:* Catches `401 Unauthorized` responses from protected endpoints, purges invalid storage, and navigates to `/login`.
- **CORS & Preflights:** Browsers enforce origin separation. Custom headers (like `Authorization`) trigger an invisible `OPTIONS` preflight request. Express must respond with `Access-Control-Allow-Origin: <exact_client_origin>` and allow `Authorization` headers.
- **Client Route Protection vs. Backend Authorization:**
  - `ProtectedRoute` is an ergonomic user-experience layer that prevents blank screens and accidental navigation to unauthorized pages.
  - Real security strictly resides on the backend via Express `protect` and `restrictTo` middleware.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Deploy a Skeleton Early (ADR 005)** | Surface CORS, HTTPS, routing, and environment variable configuration issues while the codebase is small and manageable. | Requires setting up cloud accounts and dealing with free-tier cold starts early. |
| **Centralized Axios Interceptor** | Eliminates manual header management across every component and prevents token synchronization bugs. | Global 401 handling requires explicit exceptions for login/register form errors to prevent redirection loops. |
| **Resilient Dynamic CORS Handler** | Reads `CLIENT_URL` at request time with a fallback to `http://localhost:5173`, avoiding ES module import hoisting timing bugs. | Slightly more code than a static string, but completely immune to startup race conditions. |

---

## Day 6: The Donor Experience

### 1. Concepts Learned & Solidified
- **The Four States Pattern:** Every data-fetching screen must anticipate four distinct states:
  1. *Loading:* Immediate visual feedback (spinner or skeleton) while network calls are in flight.
  2. *Error:* Clear description of failure accompanied by an `onRetry` action.
  3. *Empty:* Welcoming explanation of what's missing paired with a primary call to action (e.g. "Post your first listing").
  4. *Data:* The populated UI with list elements and interactive action controls.
- **Stable React Keys:** Using unique entity IDs (`listing._id`) rather than array indices ensures React efficiently reconciles the DOM when items are removed, completed, or rearranged.
- **Custom Hook Encapsulation (`useGeolocation`):** Abstracted `navigator.geolocation` permissions, timeouts, loading, and error states into a reusable hook that isolates browser-specific APIs from UI presentation.
- **Date & Timezone Discipline:**
  - `<input type="datetime-local">` supplies an unzoned local time string.
  - Convert to standard UTC using `new Date(value).toISOString()` before sending over HTTP.
  - Store and index UTC in MongoDB.
  - Rehydrate into user local time using `new Date(utcValue).toLocaleString()` for human display.
- **Derived State:** Expiry is calculated at render time (`displayStatus`) by comparing `expiresAt` with `Date.now()`. This avoids stale state bugs where a database document still says `available` after its deadline.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Pessimistic UI Updates (ADR 006)** | Guarantees that local UI state never diverges from database reality. | Minor perceived latency (~100ms) while waiting for network response; addressed with button loading states. |
| **Reusable Primitive Components** | `StatusBadge`, `ListingCard`, `EmptyState`, `Notice`, `ErrorMessage` are created as modular Lego blocks reusable on Day 7. | Requires establishing consistent prop contracts early. |
| **Manual Coordinate Fallback** | Allows donors on desktop browsers or with denied GPS permissions to enter coordinates manually so they are never blocked from donating food. | Requires client-side coordinate bounds validation (-90 to 90, -180 to 180). |



---

## Day 7: The NGO Experience (Map, Geolocation & Atomic Claims)

### 1. Concepts Learned & Solidified
- **Web Map Architecture & Tiles:** Web maps are composed of 256x256 pixel raster tile images fetched dynamically from a tile server (OpenStreetMap). Leaflet positions and transforms these tiles as the user pans and zooms. `react-leaflet` bridges Leaflet's imperative DOM manipulations into declarative React component lifecycles.
- **The Classic Coordinate Flip (#1 Web Mapping Trap):**
  - **MongoDB GeoJSON Standard:** Formatted as `[longitude, latitude]` (`[X, Y]` coordinate plane).
  - **Leaflet & Mapping APIs:** Formatted as `[latitude, longitude]` (`[Y, X]` navigational order).
  - *Golden Rule:* We centralized coordinate translation into a single utility helper (`utils/geo.js:listingLatLng`), strictly forbidding scattered inline array inversions.
- **Vite Asset Hashing & Leaflet Markers:** Vite hashes image filenames in production builds (e.g. `marker-icon-CrXuemCf.png`). Leaflet's default internal loader searches for static relative paths, causing missing marker icons. We resolved this in `src/leafletSetup.js` by explicitly importing Leaflet's icon assets and applying `L.Icon.Default.mergeOptions`.
- **Haversine Formula for Spherical Distance:** Because the Earth is an oblate spheroid, simple Cartesian Euclidean geometry ($a^2 + b^2 = c^2$) fails over geographic spans. The Haversine formula uses spherical trigonometry to compute precise great-circle distances directly in the browser.
- **Stale Async Responses & Race Conditions:** When a user rapidly toggles search radius (2 km $\to$ 5 km $\to$ 10 km), three asynchronous network requests run concurrently. If the 2 km query resolves *after* the 10 km query, the UI would erroneously display 2 km listings. We mitigated this by maintaining an incremental request ID counter (`latestRequest = useRef(0)`). Responses whose ID does not match the active counter are dropped immediately.
- **Pessimistic Claiming & Graceful 409 Conflict Recovery:** Claiming a donation waits for server confirmation. If another NGO claims the food first, the backend returns an HTTP 409 Conflict. Rather than crashing or showing a generic error screen, the UI treats this as an expected real-world competition outcome: it dismisses the card gracefully and displays an informative notification.
- **Tab Sandboxing & Navigation Security:** Direction links open Google Maps in a new browser tab with `target="_blank" rel="noopener noreferrer"`. This prevents the target page from obtaining a reference to `window.opener`, protecting against reverse tabnabbing and phishing attacks.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Client-Side Distance Calculation (ADR 007)** | MongoDB's `$near` sorts listings by proximity; client computes human-readable distance labels ("450 m", "3.2 km") via Haversine. | Slight trigonometric CPU computation on client, but completely unnoticeable for 10–50 items (< 1ms). |
| **Request Counter Guard (`latestRequest`)** | Eliminates stale response overwrites during rapid radius filter changes. | Does not abort TCP socket in flight, but cleanly ignores obsolete data payloads. |
| **Interactive Map Center Selection (`ClickToPick`)** | Allows volunteers to click anywhere on the map to search a different district even if browser GPS is blocked or denied. | Requires Leaflet event handlers wired through React context child components. |
| **Address Privacy Staged Rollout** | Transparent pre-claim pickup addresses retained for Day 7 MVP; address masking scheduled for Day 9 hardening. | Authenticated NGOs can see exact addresses before claiming; acceptable in trusted partner network. |

---

---

## Day 8: Real-Time Updates (Socket.IO, Rooms & Security)

### 1. Concepts Learned & Solidified
- **The Limit of Request-Response HTTP:** Traditional HTTP requires the client to request data before the server can reply. In time-critical food redistribution, WebSockets invert this paradigm: the server can push updates the millisecond a donation is posted or claimed.
- **WebSocket Protocol vs. HTTP:** WebSockets initiate via an HTTP `Upgrade` handshake and switch to a persistent, bidirectional, full-duplex TCP stream with a 2-byte framing overhead instead of kilobyte-heavy HTTP headers.
- **Socket.IO Architecture & Transports:** Socket.IO starts with HTTP long-polling and automatically upgrades to WebSocket. It adds essential production features missing from raw WebSockets: heartbeat ping/pong, automatic reconnection, and rooms.
- **Handshake Authentication Middleware:** Because a WebSocket connection is a long-lived stateful channel, it requires the same security perimeter as REST routes. We pass the JWT in `socket.handshake.auth.token`, verify it against `JWT_SECRET`, and reject unauthorized connections before they join any rooms.
- **Room Multiplexing:**
  - `ngos`: Public broadcast room for all verified NGOs. Used for `listing:new` and public `listing:updated` broadcasts.
  - `user:<id>`: Targeted private room for each user. Enables alerting a specific donor when their food is claimed, even if the donor has three browser tabs open.
- **Data Minimization in Broadcasts:** When food is claimed, non-winning NGOs only need to know that the food is no longer available. Exposing the winning NGO's name and email to all competitors violates data privacy. We sanitized broadcasts to `ngos` by stripping `claimedBy`, reserving the full document for the donor and winning NGO.
- **`useEffect` Cleanup Discipline:** Every `socket.on(event, handler)` in React must have an exact matching `socket.off(event, handler)` in the effect cleanup return function. Without this, navigating between pages accumulates duplicate event handlers, causing multiple duplicate notices for a single event.
- **Database as Source of Truth & Reconnection Recovery:** Socket events are ephemeral: if a volunteer enters an elevator or underground garage, events fired during the disconnection are lost. When Socket.IO fires `reconnect`, the client triggers an authoritative REST API reload to recover true state.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Socket.IO over Polling (ADR 008)** | Sub-second latency (< 100ms) with minimal idle network overhead; provides built-in room multiplexing. | Requires separate WebSocket CORS configuration and `socket.io-client` on the frontend. |
| **Emit After Database Write** | Sockets never announce an action before the database confirms success. | Minor execution delay (a few ms) until DB write completes, preventing false-positive notifications. |
| **Sanitized Broadcasts (`except`)** | Protects NGO privacy by omitting `claimedBy` from general NGO broadcasts. | Requires dual-path emission logic in `server/sockets/emit.js`. |
| **Navbar Live / Offline Indicator** | Gives users immediate visual feedback regarding their real-time connection status. | Requires tracking socket connection state in a centralized `SocketContext`. |

---

---

## Day 9: Hardening, Polish and Buffer

### 1. Concepts Learned & Solidified
- **Never Trust the Client:** Client-side form constraints (disabling buttons, HTML5 `required`) are user-experience conveniences, not security gates. Every constraint (quantities, dates, roles, ownership) must be strictly validated by the backend.
- **Middleware Ordering as Application Behavior:** In Express, middleware executes in the exact order declared:
  - `trust proxy` must precede rate limiting so `req.ip` reflects the real client.
  - `helmet` and `cors` must precede routes so headers attach to every response.
  - Body parsers must enforce size limits before routing.
  - `GET /api/health` must precede rate limiters so monitoring probes never get throttled.
- **Reverse Proxy Topology & `trust proxy`:** Render forwards incoming requests through an edge proxy. Without `app.set('trust proxy', 1)`, Express assumes the request originated from the proxy's IP, collapsing all users into a single shared rate-limit bucket.
- **Two-Tiered Rate Limiting:**
  - *General API:* High limit (1000 req/15 min) to prevent denial-of-service and runaway loops.
  - *Authentication:* Tight limit (20 failed req/15 min) with `skipSuccessfulRequests: true` to prevent credential stuffing without punishing valid users.
- **MongoDB Aggregation as a Database-Level Pivot Table:** Instead of querying all completed listings into Node.js memory and iterating with `reduce()`, `$match` and `$group` compute the sums (`$sum: '$quantity'`) directly inside the database engine.
- **Automated Testing with Node's Native Runner (`node:test`):** Node 18+ provides built-in testing without Jest or Mocha. We structured 23 pure in-memory and HTTP integration tests running in < 500ms.
- **Keyboard Accessibility & Focus Indicators:** Added `:focus-visible` outlines so users navigating via Tab, Shift+Tab, and Enter can visually track interactive elements.

### 2. Architectural Decisions Made Today
| Decision | Rationale | Trade-offs Considered |
|---|---|---|
| **Two-Tiered Rate Limiting (ADR 009)** | Blocks brute-force login attacks while keeping normal browsing smooth. | In-memory store resets on server restart; shared store (Redis) required for multi-server clusters. |
| **10 KB Payload Size Limit** | Prevents memory allocation denial-of-service from massive JSON payloads. | Rejects files or bulk uploads, which is appropriate since AnnaSeva does not accept image uploads in MVP. |
| **Live Database Aggregation for Stats** | Always reflects real-time rescued meals without background cron synchronizers. | Executes one aggregation per visitor; can be cached with a 30s TTL under high traffic. |
| **Visible Keyboard Focus Styling** | Meets WCAG AA accessibility standards for non-mouse users. | Adds visible outlines on focused controls. |

---

## Day 10: Retrospective, Presentation & Final Milestone

### 1. Answers to Retrospective Questions

#### Q1: What was the hardest problem?
The hardest problem was **concurrency control during atomic food claiming**. Traditional web development tutorials teach the pattern of fetching a document, checking its status in JavaScript, modifying its properties, and calling `.save()`. Under concurrent execution (e.g., two volunteers tapping "Claim" within milliseconds), this "read-then-write" approach inevitably fails because both requests read `status: 'available'` before either has written `status: 'claimed'`. Pushing synchronization into MongoDB's atomic `findOneAndUpdate({ _id, status: 'available' })` was the breakthrough: it guaranteed that the condition evaluation and state mutation occurred as one indivisible operation protected by MongoDB's document-level locks.

#### Q2: What surprised me?
What surprised me most was **how much architectural behavior is determined by middleware ordering in Express**. Simply moving `GET /api/health` before `apiLimiter` prevented cloud uptime monitors from exhausting rate limits. Similarly, moving `app.set('trust proxy', 1)` before rate limiting completely changed whether `req.ip` resolved the cloud load balancer's internal router or the user's actual browser. Security and stability in Express are largely a function of pipeline topology.

#### Q3: Which concepts can I explain confidently?
- The anatomy of JWT stateless authentication and how digital signatures prevent tampering.
- How MongoDB `2dsphere` indexes work with spherical geometry and why coordinate order differs between GeoJSON `[lng, lat]` and Leaflet `[lat, lng]`.
- Concurrency race conditions and why atomic database operations are necessary.
- WebSocket lifecycle, room multiplexing, and why the database must remain the single source of truth rather than socket event streams.
- Defensive API security: Helmet headers, payload bounds, and proxy-aware rate limiting.

#### Q4: Which concepts remain unclear or need deeper study?
- **Horizontal WebSocket Scaling:** How to orchestrate sticky sessions and Redis Pub/Sub adapters across multiple containerized Node.js processes running in Kubernetes or AWS ECS.
- **Advanced Database Sharding:** How MongoDB distributes geospatial `2dsphere` indexes across geographically distributed shards without suffering cross-shard scatter-gather query latency.

#### Q5: What would I do differently if I started again?
I would introduce **TypeScript** from Day 1. While Zod schemas provided excellent runtime validation at the API boundary, having static type definitions shared between client and server would have caught coordinate format flips (`[lat, lng]` vs `[lng, lat]`) at compile-time rather than during manual map testing.

#### Q6: What did I learn about full-stack development?
Full-stack development is not about writing frontend buttons and backend routes in isolation; it is about **designing resilient contracts between layers**. Data minimization, clean loading/empty/error states, idempotent mutations, and graceful reconnection handling are what elevate a simple coding exercise into a production-grade software product.

#### Q7: How did AI help, and where was its output incorrect?
AI acted as an outstanding architectural mentor and rubber-duck partner—helping brainstorm edge cases, explain KaTeX KaTeX KaTeX/Spherical math formulas, and design concurrency stress tests. However, AI often hallucinated outdated syntax (such as deprecated Express response patterns or obsolete React Router v5 methods). I learned to treat AI output as a draft: always cross-referencing installed package documentation, reading actual error logs, and never accepting code I could not explain line-by-line.

#### Q8: What should I learn next?
Based on my experience building AnnaSeva, my prioritized technical learning roadmap is:
1. **TypeScript:** Migrating MERN architectures to full end-to-end type safety.
2. **End-to-End Testing (Playwright / Cypress):** Automated browser testing simulating multi-user donor/NGO claim flows.
3. **CI/CD Automation (GitHub Actions):** Automated linting, test runners, and zero-downtime deployment pipelines.
4. **Redis Caching & Sockets:** Distributed caching for hot reads (stats) and the Socket.IO Redis adapter for horizontal scaling.
5. **Progressive Web App (PWA):** Service workers and offline caching for field volunteers in low-connectivity areas.

---

