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
