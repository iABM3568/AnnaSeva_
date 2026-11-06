# AnnaSeva — Portfolio Presentation, Resume Bullets & LinkedIn Package

This document contains ready-to-use professional materials for showcasing AnnaSeva across GitHub, your software engineering resume, and LinkedIn.

---

## 1. GitHub Repository Configuration

### About Box (Repository Header)
- **Description:**
  ```text
  Full-stack surplus food redistribution platform connecting restaurants and NGOs in real-time with atomic claim concurrency, geospatial discovery, and defensive API hardening.
  ```
- **Website URL:**
  ```text
  https://annaseva.vercel.app
  ```
- **Topics (Tags):**
  ```text
  mern, react, nodejs, express, mongodb, socket-io, leaflet, tailwindcss, jwt, geospatial, real-time, concurrency-control
  ```

### Repository Pinning Instructions
1. Open your GitHub Profile page (`https://github.com/<your-username>`).
2. Click **Customize your pins** (or click the edit button next to "Pinned").
3. Check the box for **`AnnaSeva_`** (or `annaseva`).
4. Click **Save pins** to display AnnaSeva prominently at the top of your portfolio.

---

## 2. Professional Resume Bullets

Copy and paste these bullet points directly into your Resume under **Projects** or **Technical Experience**:

```text
• Engineered AnnaSeva, a production-ready full-stack MERN platform connecting surplus food donors with nearby NGOs; implemented role-based authorization, JWT stateless auth, and sub-100ms real-time WebSocket notifications via Socket.IO.
• Eliminated double-allocation race conditions under high concurrency using atomic MongoDB findOneAndUpdate operations, validated through a 20-request simultaneous claim stress test (yielding 1 success and 19 conflicts); integrated 2dsphere geospatial indexing for radius-based proximity discovery on interactive Leaflet maps.
• Hardened Express API security with Helmet HTTP protection, 10 KB body size limits, edge-proxy-aware rate limiting, and a zero-dependency automated test suite (23/23 tests passing using node:test); deployed cross-cloud on Vercel, Render, and MongoDB Atlas.
```

---

## 3. LinkedIn Project Announcement

Copy this draft for your LinkedIn project launch post. It follows the proven technical storytelling framework: Problem -> Solution -> Core Technical Lesson -> Stack -> Live Links.

```markdown
I just wrapped up the engineering of AnnaSeva (अन्न सेवा) — a full-stack surplus food redistribution platform built to bridge the time gap between edible food waste and hunger relief.

🍽️ The Problem:
Commercial kitchens, banquet halls, and restaurants frequently finish daily service with dozens of fresh, edible meals that end up in landfills simply because they lack an immediate coordination channel with local charities before the food spoils.

🌱 The Solution:
AnnaSeva connects food donors with local NGOs in real time:
1. Donors post surplus food in under 60 seconds with pickup deadlines and GPS coordinates.
2. Nearby NGOs discover active food on an interactive Leaflet map filtered by radius (5–50 km) via MongoDB 2dsphere geospatial indexing.
3. Socket.IO pushes live updates instantly across active clients without browser refreshes.
4. An atomic database reservation engine ensures exactly one NGO can claim a donation, even if multiple volunteers tap "Claim" at the exact same millisecond.

💡 The Key Engineering Lesson:
High-concurrency consistency cannot be solved on the client or with simple application-level checks. Traditional "read-then-write" patterns fail under simultaneous requests. Pushing synchronization directly to MongoDB's atomic conditional update primitives (`findOneAndUpdate` with `{ status: 'available' }`) completely eliminated race conditions, which I verified with a 20-request automated stress test.

🛠️ The Stack:
• Frontend: React 19, Vite, Tailwind CSS v4, React Router v7, Leaflet
• Backend: Node.js 22, Express 5, Socket.IO 4.8, Zod, Helmet, Express-Rate-Limit
• Database: MongoDB Atlas (Geospatial 2dsphere indexing & aggregation pipelines)
• Testing & Deploy: Native `node:test` (23 automated tests), Vercel, Render

Live Demo: https://annaseva.vercel.app
Source Code & System Design Notes: https://github.com/iABM3568/AnnaSeva_

I would love to hear your feedback on the architecture!

#MERN #ReactJS #NodeJS #WebDevelopment #SystemDesign #OpenSource #SoftwareEngineering #MongoDB #SocketIO
```
