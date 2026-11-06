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

