# AnnaSeva (FoodBridge) — Engineering Progress Report: Day 1 & Day 2

**Project:** AnnaSeva / FoodBridge (Surplus Food Redistribution Platform)  
**Technology Stack:** Node.js, Express.js (v5), MongoDB Atlas, Mongoose (v9), Zod (v3/v4), Bcrypt.js, JSON Web Tokens (JWT)  
**Repository:** [https://github.com/iABM3568/AnnaSeva_](https://github.com/iABM3568/AnnaSeva_)  
**Current Branch:** `main` (Fully synced with GitHub)

---

## Executive Summary

Over the course of **Day 1** and **Day 2**, the technical foundation and security backbone of the AnnaSeva backend were designed and implemented. Rather than producing superficial prototype code, the project was engineered according to production-grade standards:

1. **Day 1** delivered a clean modular Express architecture, strict Git security boundaries, database connection lifecycle management, and a live health monitoring endpoint.
2. **Day 2** delivered a complete, hardened authentication and role-based authorization system featuring salted bcrypt password hashing, dual-layer Zod validation, mass-assignment defense, stateless JWT tokens, centralized error handling, and Thunder Client integration.

---

## 1. Day 1 Achievements: Architecture & Foundations

### 1.1 Modular Server Architecture
We established a strict separation of concerns between application setup and server bootstrapping:
* [`server/app.js`](file:///Users/iabm3568/AnnaSeva2/server/app.js): Responsible exclusively for initializing Express, configuring global middleware (CORS, JSON body parser), and registering API routes. **It does not bind to a network port.** This allows fast, deterministic API testing (e.g., via Supertest) without opening network sockets.
* [`server/server.js`](file:///Users/iabm3568/AnnaSeva2/server/server.js): The entry point of the application. It loads environment variables first via `dotenv/config`, initiates database connectivity, imports `app`, and binds to `process.env.PORT || 5000`.

### 1.2 Fail-Fast Database Lifecycle
* [`server/config/db.js`](file:///Users/iabm3568/AnnaSeva2/server/config/db.js): Built using Mongoose with a fail-fast pattern. If the database connection cannot be established on startup, the application logs the error diagnostics and calls `process.exit(1)`. This prevents the server from running as an unresponsive or broken "zombie" process.

### 1.3 Security & Secret Isolation
* Root [`.gitignore`](file:///Users/iabm3568/AnnaSeva2/.gitignore) was created with strict isolation rules:
  * `server/.env` and `.env.*` are completely ignored, preventing accidental leaks of database credentials and API secrets.
  * `server/node_modules/` is excluded to keep the repository lightweight.
  * System metadata (`.DS_Store`, `Thumbs.db`, `*.log`) is ignored.
* [`server/.env.example`](file:///Users/iabm3568/AnnaSeva2/server/.env.example) was created and tracked in Git with sanitized placeholders, providing a setup template for new team members.

### 1.4 Baseline Health Check
* `GET /api/health` was mounted, returning `{ "status": "ok", "time": "<ISO timestamp>" }` with HTTP 200 to serve as an uptime probe for cloud deployment platforms and load balancers.

### 1.5 Git & GitHub Synchronization
* Initialized local Git repository on `main`.
* Reconciled initial GitHub `LICENSE` commit via linear rebase without losing history.
* Established feature branch workflow (`feature/server-setup`).

---

## 2. Day 2 Achievements: Users, Authentication & Authorization

### 2.1 Mongoose User Model ([`server/models/User.js`](file:///Users/iabm3568/AnnaSeva2/server/models/User.js))
* **Strict Schema Definition:** Enforces required types, trimming, string lengths, and role enumeration (`donor` or `ngo`).
* **Sensitive Field Protection (`select: false`):** The `password` field is hidden by default in all Mongoose queries, preventing accidental leaks in API responses.
* **Pre-Save Bcrypt Hashing:** A Mongoose pre-save hook intercepts password changes, generates a salt, and hashes the password with **bcrypt cost factor 12** (4,096 computation rounds).
* **Idempotency Guard (`this.isModified('password')`):** Ensures that updating unrelated fields (e.g., name or organization) does not re-hash an already hashed password.
* **Instance Method (`comparePassword`):** Encapsulates bcrypt verification directly on the user document.
* **`toJSON` Transformation:** Custom JSON serializer strips `password` and `__v` before sending responses to clients.

### 2.2 Dual-Layer Validation Pipeline
To ensure robust security, validation happens at two distinct boundaries:
1. **API Gateway Layer (Zod):** [`server/validators/auth.schema.js`](file:///Users/iabm3568/AnnaSeva2/server/validators/auth.schema.js) validates incoming inputs before business logic executes.
   * `registerSchema`: Validates name (2-80 chars), email format (lowercased & trimmed), password length (8-72 chars, respecting bcrypt's 72-byte truncation boundary), and strict role enums (`donor` or `ngo`).
   * `loginSchema`: Validates email and presence of password.
2. **Reusable Validation Middleware ([`server/middleware/validate.js`](file:///Users/iabm3568/AnnaSeva2/server/middleware/validate.js)):**
   * Uses `schema.safeParse()`.
   * Formats validation issues into structured JSON error arrays.
   * Stores sanitized, validated data at **`req.valid`**.
   * **Mass-Assignment Defense:** By having controllers read exclusively from `req.valid` rather than raw `req.body`, malicious injection of unauthorized attributes (such as `role: "admin"` or `isAdmin: true`) is completely neutralized.

### 2.3 JWT Generation & Stateless Auth ([`server/utils/generateToken.js`](file:///Users/iabm3568/AnnaSeva2/server/utils/generateToken.js))
* Signs tokens using a cryptographically secure 64-byte secret (`JWT_SECRET`).
* Embeds only non-sensitive identity claims: `id` (MongoDB ObjectId) and `role` (`donor` or `ngo`).
* Sets a 7-day expiration (`expiresIn: '7d'`).

### 2.4 Authentication Controllers ([`server/controllers/auth.controller.js`](file:///Users/iabm3568/AnnaSeva2/server/controllers/auth.controller.js))
* **`register`:** Checks for duplicate emails (returning `409 Conflict`), creates the user, generates a JWT, and returns `201 Created`.
* **`login`:** Retrieves user with `.select('+password')`, verifies hash via `comparePassword()`, issues a token, and returns `200 OK`.
  * **User Enumeration Protection:** Emits an identical generic message (`"Invalid email or password"`) for both non-existent emails and incorrect passwords, preventing attackers from harvesting valid accounts.
* **`getMe`:** Returns the authenticated user's profile (`200 OK`) retrieved from `req.user`.

### 2.5 Security Guards: Authentication & Authorization ([`server/middleware/auth.js`](file:///Users/iabm3568/AnnaSeva2/server/middleware/auth.js))
* **`protect` (Authentication Guard):**
  * Extracts the token from the `Authorization: Bearer <token>` header.
  * Verifies cryptographic signature and expiry via `jwt.verify()`.
  * Validates that the user still exists in MongoDB (handling deleted or banned accounts).
  * Attaches the verified user document to `req.user`.
* **`restrictTo(...roles)` (Role-Based Authorization Guard):**
  * Restricts endpoint access to specified roles (e.g., `restrictTo('donor')`).
  * Emits `403 Forbidden` if `req.user.role` does not match the permitted roles.
  * Requires `protect` to run first to guarantee `req.user` is populated.

### 2.6 Centralized Error Handling ([`server/middleware/error.js`](file:///Users/iabm3568/AnnaSeva2/server/middleware/error.js))
* **`notFound`:** Intercepts unmapped endpoints and returns a clean `404 Not Found` JSON payload (`Cannot find METHOD /path on this server`).
* **`errorHandler`:** Standard 4-argument Express handler that normalizes:
  * Malformed JSON syntax in request bodies (`400 Bad Request`).
  * MongoDB unique index duplicate keys (error code 11000 $\rightarrow$ `409 Conflict`).
  * Mongoose validation errors (`400 Bad Request`).
  * Mongoose invalid ObjectIds / CastErrors (`400 Bad Request`).
  * Internal server errors (`500 Internal Server Error`).

---

## 3. Project File Tree (End of Day 2)

```text
AnnaSeva2/
├── .gitignore                                         # Git exclusion rules
├── LICENSE                                            # MIT License
├── README.md                                          # Project overview and vision
├── .thunderclient/
│   └── thunder-collection_FoodBridge.json            # 14 pre-wired API tests
├── client/
│   └── .gitkeep                                      # Reserved for Day 5 React frontend
├── docs/
│   ├── DAY_1_AND_2_REPORT.md                         # Comprehensive progress report
│   ├── decisions.md                                  # Architectural Decision Records (ADR 001)
│   ├── journal.md                                    # Engineering journal & reflections
│   ├── plan.md                                       # Master 10-day engineering plan
│   └── requirements.md                               # Product specs & capacity estimation
└── server/
    ├── .env                                          # Local secrets (IGNORED BY GIT)
    ├── .env.example                                  # Sanitized environment template
    ├── app.js                                        # Express application configuration
    ├── package-lock.json                             # Exact dependency lockfile
    ├── package.json                                  # Project manifest (ES Modules)
    ├── server.js                                     # Server entry point & DB bootstrap
    ├── config/
    │   └── db.js                                     # Mongoose fail-fast connection
    ├── controllers/
    │   └── auth.controller.js                        # register, login, getMe
    ├── middleware/
    │   ├── auth.js                                   # protect & restrictTo guards
    │   ├── error.js                                  # notFound & errorHandler
    │   └── validate.js                               # Zod schema validation middleware
    ├── models/
    │   └── User.js                                   # User schema, bcrypt hooks, methods
    ├── routes/
    │   └── auth.routes.js                            # /api/auth route definitions
    ├── utils/
    │   └── generateToken.js                          # JWT signing utility
    └── validators/
        └── auth.schema.js                            # Zod input schemas
```

---

## 4. Installed Dependencies

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.6",
    "dotenv": "^18.0.9",
    "express": "^5.3.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^9.12.0",
    "zod": "^3.24.2"
  }
}
```

---

## 5. Architectural Decision Records (ADR) Summary

### ADR 001: Token Delivery & Storage Strategy
* **Decision:** Adopt `Authorization: Bearer <token>` with client-side storage (`localStorage`) for initial development and Day 5 frontend integration.
* **Trade-off Analysis:**
  * *`localStorage`:* Simple to inspect in developer tools and test in API clients; vulnerable to Cross-Site Scripting (XSS).
  * *`httpOnly` Cookies:* Immune to JavaScript XSS access; introduces Cross-Site Request Forgery (CSRF) complexity and cross-origin configuration friction.
* **Roadmap:** Retain `localStorage` for rapid MVP iteration; evaluate migrating to `httpOnly` secure cookies with `SameSite=Strict` prior to production release.

---

## 6. Verification and Test Results

| # | Test Case | Target Endpoint | Expected Status | Result |
|---|---|---|---|---|
| 1 | Uptime Health Check | `GET /api/health` | 200 OK | **PASSED ✅** |
| 2 | Route Not Found (404 Handler) | `GET /api/does-not-exist` | 404 Not Found | **PASSED ✅** |
| 3 | Registration Password < 8 Chars | `POST /api/auth/register` | 400 Bad Request | **PASSED ✅** |
| 4 | Registration with Role "admin" | `POST /api/auth/register` | 400 Bad Request | **PASSED ✅** |
| 5 | Mass Assignment Sanitization (`isAdmin`) | `POST /api/auth/register` | Stripped from payload | **PASSED ✅** |
| 6 | Password Hashing Verification | Model pre-save | Starts with `$2b$12$` | **PASSED ✅** |
| 7 | Correct Password Validation | `comparePassword()` | Returns `true` | **PASSED ✅** |
| 8 | Incorrect Password Validation | `comparePassword()` | Returns `false` | **PASSED ✅** |
| 9 | `toJSON` Sensitive Field Removal | Model serialization | `password` & `__v` absent | **PASSED ✅** |
| 10 | Protected Route Missing Token | `GET /api/auth/me` | 401 Unauthorized | **PASSED ✅** |
| 11 | Protected Route Tampered Token | `GET /api/auth/me` | 401 Unauthorized | **PASSED ✅** |
| 12 | JWT Claims Structure | Decoded Token | Contains `id`, `role`, `exp` | **PASSED ✅** |
| 13 | Role Guard Donor Access | `restrictTo('donor')` | Allowed through | **PASSED ✅** |
| 14 | Role Guard NGO Denial | `restrictTo('donor')` | 403 Forbidden | **PASSED ✅** |

---

## 7. Git Commit History

The repository has maintained a clean, linear history with standard conventional commit messaging:

```text
* 5150a99 (HEAD -> main, origin/main, feature/auth) docs: record token storage decision
* e2c3d01 feat(auth): protect and restrictTo middleware
* 1af3365 feat(auth): register, login and me endpoints
* 04cc51f feat: add validation and error-handling middleware
* 931a2d2 feat(auth): add User model with hashed passwords and Zod schemas
* 69839fb chore: normalize trailing newlines across project files
* 0e0cb9b docs: add requirements and engineering journal
* 80f6e79 feat(server): connect to MongoDB Atlas
* b43228f feat(server): express app with health route
* 54e7265 chore(server): init project and install dependencies
* d94b40d chore: initial project structure and gitignore
* 0fb55cc Initial commit (LICENSE)
```

---

## 8. Readiness for Day 3

The application is completely prepared for **Day 3: The Listings API**:
* User roles (`donor` and `ngo`) are established and enforceable.
* Authentication and authorization guards (`protect`, `restrictTo`) are tested and ready.
* Zod schema validation patterns are established.
* Error handling and HTTP responses follow uniform standards across the system.

