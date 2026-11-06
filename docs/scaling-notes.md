# AnnaSeva — System Design & Scaling Notes (Day 9)

## 1. What Breaks First at 100x Traffic?
If traffic increases by 100x overnight, two bottlenecks will fail before anything else:
1. **MongoDB Atlas Free Tier Throttling (~100 ops/second & 512 MB Storage):**
   Atlas M0 free clusters enforce strict operation-per-second ceilings and connection caps (500 connections). High concurrency on `/api/listings/nearby` geospatial `$near` queries combined with writes will lead to query queuing, connection timeouts, and throttling.
2. **Single-Threaded Node.js Event Loop on Render Free Tier:**
   Render's free tier provides 0.1 CPU cores and 512 MB RAM. Synchronous cryptographic operations (even with bcrypt threadpool) and JSON parsing of hundreds of simultaneous payloads will starve the single Node.js event loop, causing HTTP latency spikes.

---

## 2. What Happens to Rate Limiter Counters Across Multiple Servers?
- **Current State:** `express-rate-limit` counters reside inside the Node process memory heap (`MemoryStore`).
- **Failure Mode with Multiple Servers:** When traffic is load-balanced across Server A and Server B, a client making requests will have their budget split. An attacker could send 20 failed login guesses to Server A and 20 to Server B (40 total) before triggering an HTTP 429.
- **Architectural Solution:** Replace `MemoryStore` with a centralized in-memory store like **Redis** using the `rate-limit-redis` package. All server instances decrement a shared atomic key with a Redis TTL.

---

## 3. What Happens to Socket.IO Events Across Multiple Servers?
- **Current State:** Socket.IO connections are stateful TCP connections maintained in the local memory of the specific Node server instance where the client connected.
- **Failure Mode with Multiple Servers:** If Donor A connects to Server 1 and NGO B connects to Server 2, when Donor A posts food on Server 1, `io.to('ngos').emit(...)` only reaches NGOs connected to Server 1. NGO B on Server 2 never receives the event.
- **Architectural Solution:**
  1. **Socket.IO Redis Adapter (`@socket.io/redis-adapter`):** Configures server instances to publish events to a central Redis Pub/Sub channel. When Server 1 emits, Redis broadcasts the message to Server 2, which pushes it down to its connected sockets.
  2. **Sticky Sessions (Session Affinity):** For polling fallbacks, the load balancer must route subsequent HTTP polling requests from the same socket ID to the exact same server instance.

---

## 4. Which Endpoint Could Benefit Most from Caching?
- **Endpoint:** `GET /api/stats`
- **Why:** The impact metrics (total meals rescued and completed pickups) are completely anonymous and identical for every visitor on the landing page.
- **Trade-off:** Introducing a 30-second TTL in-memory cache means the counter displayed to a visitor could lag database updates by up to 30 seconds. In return, it completely protects the database from having to execute aggregate pivot tables during traffic spikes.

---

## 5. Which Query is Hardest to Cache?
- **Endpoint:** `GET /api/listings/nearby?lat=...&lng=...&radiusKm=...`
- **Why:** Every user supplies a unique floating-point coordinate (`lat`, `lng`) and a variable search radius. Traditional URL key-value caching has a near-zero cache hit rate because coordinates rarely match down to 4 decimal places.
- **Mitigation:** Rely on MongoDB's `2dsphere` spatial index and bounding-box geohash buckets rather than HTTP response caching.

---

## 6. Single Points of Failure (SPOFs)
1. **Single Render Web Service Instance:** If Render's container sleeps or crashes, the entire REST API and WebSocket gateway go offline.
2. **Single Primary Database Cluster (Atlas M0):** Free-tier clusters lack dedicated replica set failover and multi-region redundancy.
3. **In-Memory JWT Revocation:** We currently use stateless JWTs without a revocation blacklist. If a token is compromised, it cannot be revoked before its expiration deadline unless a centralized token blocklist is introduced.

---

## 7. What Should Be Monitored in Production?
1. **Uptime & Liveness:** Automated pinging of `GET /api/health` every 60 seconds.
2. **Error Rates:** Spikes in HTTP 5xx responses (unhandled exceptions, database drops).
3. **Throttling Metrics:** Frequency of HTTP 429 Too Many Requests to detect credential stuffing or overly aggressive rate limit windows.
4. **Database Performance:** MongoDB Atlas read/write latency, slow queries (> 100ms), and connection pool saturation.
5. **WebSocket Health:** Active connection counts, handshake rejection rates, and disconnect reasons.

---

## 8. Pragmatic Scaling Roadmap
1. **Tier 1 (Zero-Cost Optimization — Completed):** Database indexes (`2dsphere`, unique email), efficient projections, payload limits (10 KB), and client-side Haversine distance computations.
2. **Tier 2 (Read Protection):** Add short-lived TTL caching (30s) to `/api/stats`.
3. **Tier 3 (Horizontal Scaling):** Scale to multiple Node instances backed by an Upstash/ElastiCache Redis cluster for Socket.IO Pub/Sub and centralized rate limiting.
4. **Tier 4 (Database Upgrade):** Migrate from Atlas M0 to Atlas M10 with dedicated RAM, automated backup snapshots, and multi-AZ replica set failover.
