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
