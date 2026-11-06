# AnnaSeva — Product Requirements & Specifications

## 1. Project Overview
**AnnaSeva** (अन्न सेवा — *Service through Food*) is a full-stack MERN platform designed to bridge the critical time gap between surplus food availability and hunger relief. 

Restaurants, caterers, hotels, party halls, and hostel messes frequently finish operations with excess, edible food that would otherwise be discarded. Concurrently, local NGOs, shelters, and community kitchens require food donations but lack real-time visibility into what is available nearby. AnnaSeva provides a reliable, real-time coordination engine connecting donors with verified NGOs before food spoils.

---

## 2. Main User Roles

| Role | Description | Primary Needs |
|---|---|---|
| **Food Donor** | Commercial kitchens, restaurants, wedding halls, event caterers | Fast listing creation, clear pickup windows, claim tracking, ability to mark picked up or cancel. |
| **NGO Partner** | Registered charities, orphanages, shelters, volunteer feeding networks | Proximity-based discovery (maps and list), atomic one-click claiming, turn-by-turn directions. |
| **Platform Admin** *(Future)* | System administrators | Platform health monitoring, dispute moderation, organization verification, impact metrics. |

---

## 3. Functional Requirements

### 3.1 Authentication & Accounts *(Scheduled Day 2)*
- Secure registration and login for Donors and NGOs.
- Passwords hashed using bcrypt.
- Stateless authentication using JSON Web Tokens (JWT) stored securely.

### 3.2 Food Listings Management *(Scheduled Day 3)*
- Donors can create listings specifying:
  - Food item title and description.
  - Quantity / estimated servings.
  - Dietary category (Veg, Non-Veg, Vegan).
  - Preparation timestamp and strict expiry / pickup deadline.
  - Pickup address and geospatial coordinates (latitude / longitude).
- Donors can view, edit, or cancel their own active listings.
- Donors can mark a claimed listing as completed ("Picked Up").

### 3.3 Discovery & Geospatial Search *(Scheduled Day 3 & Day 7)*
- NGOs can query listings within a given radius (e.g., 5km, 10km) using MongoDB 2dsphere indexing.
- Automatic filtering: expired or already claimed food must never appear in search results.

### 3.4 Atomic Claim System *(Scheduled Day 4)*
- Concurrency control: A listing can be claimed by **exactly one** NGO.
- High-concurrency safety using atomic database updates (`findOneAndUpdate` with state preconditions) to eliminate race conditions.

### 3.5 Real-Time Communication *(Scheduled Day 8)*
- WebSocket integration (Socket.IO) to push new listings and claim events instantly to connected clients without browser refresh.

---

## 4. Non-Functional Requirements

| Dimension | Specification | Implementation Strategy |
|---|---|---|
| **Correctness** | Zero double-claims under concurrent requests | Atomic MongoDB conditional queries. |
| **Data Freshness** | Expired listings hidden immediately | Expiry timestamp queries and scheduled cleanup. |
| **Security** | Secrets isolated from source control; secure headers | `.env` files via `dotenv`, CORS restrictions, password hashing. |
| **Availability & Health** | Proactive health checks | Lightweight `/api/health` JSON endpoint. |
| **Usability** | Mobile responsive | Clean responsive UI with clear loading and error feedback. |
| **Maintainability** | Clean separation of concerns | Modular architecture separating server lifecycle (`server.js`), route configuration (`app.js`), and database connection (`config/db.js`). |

---

## 5. Capacity Estimation (Back-of-the-Envelope)

- **Target MVP Community:**
  - 500 Active Food Donors × 3 listings/day = 1,500 listing writes/day.
  - 2,000 Active NGOs × 5 status checks/day = 10,000 read queries/day.
- **Traffic Throughput:**
  - Total daily requests: ~11,500 requests/day.
  - Average request rate: ~0.13 requests per second (~1 request every 8–9 seconds).
  - Peak burst assumption (5x average): ~1 request per second.
- **Architectural Conclusion:**
  - A single modest Node.js/Express service backed by a MongoDB Atlas M0 (Free Tier) cluster easily supports this workload with sub-50ms latency. No complex distributed microservices or caching layers are required for Day 1.

---

## 6. Initial Assumptions & Boundary Conditions
1. MVP is focused on hyper-local urban food redistribution (5–15 km delivery radius).
2. Transportation logistics are handled directly by the claiming NGO.
3. Donors guarantee food quality and declare preparation time truthfully.
