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


