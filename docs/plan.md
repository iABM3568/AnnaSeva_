# AnnaSeva: 10-Day Build-and-Learn Plan (MERN)

> **What this is:** a day-by-day self-study plan that takes AnnaSeva from an empty folder to a deployed, demo-ready, *explainable* full-stack app.
> **Who it's for:** a beginner who learns by building, and uses AI as a tutor and pair-programmer, not as a code vending machine.
> **How to use it:** save this file as `docs/plan.md` in your repo. Tick the `- [ ]` boxes as you go (VS Code's Markdown preview and GitHub both render them).
> **About the name:** *anna* (अन्न) means food or grain, and *seva* (सेवा) means selfless service. **AnnaSeva** is "service through food": surplus food, shared with the people who need it.

---

## Table of Contents

- [0. How to Use This Plan](#0-how-to-use-this-plan)
- [1. The Project at a Glance](#1-the-project-at-a-glance)
- [2. The Tech Stack and Why](#2-the-tech-stack-and-why)
- [3. Architecture](#3-architecture)
- [4. Data Model and API](#4-data-model-and-api)
- [5. File Structure](#5-file-structure)
- [6. Pre-Flight Setup](#6-pre-flight-setup)
- [7. Git and GitHub Crash Course](#7-git-and-github-crash-course)
- [8. Web Basics You Need](#8-web-basics-you-need)
- [9. Working With AI](#9-working-with-ai)
- [10. Daily Rhythm and Getting Unstuck](#10-daily-rhythm-and-getting-unstuck)
- [Day 1: Foundations, Git and the First Server](#day-1-foundations-git-and-the-first-server)
- [Day 2: Users and Authentication](#day-2-users-and-authentication)
- [Day 3: The Listings API](#day-3-the-listings-api)
- [Day 4: The Claim System and the System-Design Lab](#day-4-the-claim-system-and-the-system-design-lab)
- [Day 5: React, Login Screens and the First Deploy](#day-5-react-login-screens-and-the-first-deploy)
- [Day 6: The Donor Experience](#day-6-the-donor-experience)
- [Day 7: The NGO Experience (Map and Claim)](#day-7-the-ngo-experience-map-and-claim)
- [Day 8: Real-Time Updates](#day-8-real-time-updates)
- [Day 9: Hardening, Polish and Buffer](#day-9-hardening-polish-and-buffer)
- [Day 10: Docs, Demo and Interview Prep](#day-10-docs-demo-and-interview-prep)
- [Appendix A: Deployment Troubleshooting](#appendix-a-deployment-troubleshooting)
- [Appendix B: README Template](#appendix-b-readme-template)
- [Appendix C: Interview Questions](#appendix-c-interview-questions)
- [Appendix D: Demo Script, Pitches and Event Checklist](#appendix-d-demo-script-pitches-and-event-checklist)
- [Appendix E: Stretch Goals](#appendix-e-stretch-goals)
- [Appendix F: Glossary](#appendix-f-glossary)
- [Appendix G: Resources](#appendix-g-resources)
- [Appendix H: Progress Tracker](#appendix-h-progress-tracker)

---

## 0. How to Use This Plan

### The one rule: Understand, Build, Explain

Every feature must pass three gates before you tick it off:

1. **Understand:** you can explain the concept in plain words, with an analogy.
2. **Build:** it works, you tested it, and it is committed to Git.
3. **Explain:** you can describe it out loud *without looking at the code*.

If you pass gate 2 but fail gate 3, the feature is **not done**. This is the difference between "I finished a project" and "I can talk about my project in an interview."

### Level markers used in this document

| Marker | Meaning |
|---|---|
| 🟢 | Beginner: you must understand this |
| 🟡 | Intermediate: understand the idea; details can come later |
| 🔴 | Advanced: optional deep dive, skip if you're behind |

### Other markers

| Marker | Meaning |
|---|---|
| 🧠 | Self-ask questions: answer in writing, without looking at the code |
| 🤖 | AI prompts: how to use AI to learn, not just to get code |
| ⚠️ | Common mistakes and how to recognise them |

### The 10-day overview

| Day | Theme | You can demo at the end of the day |
|---|---|---|
| 1 | Foundations, Git, first server | `GET /api/health` works locally; database connected; repo on GitHub |
| 2 | Users and authentication | Register / login / "who am I" through Thunder Client; role-protected route |
| 3 | Listings API | Donor creates a listing; NGO searches "nearby" |
| 4 | Claim system and system-design lab | Atomic claim; race test passes; seed data |
| 5 | React, login UI, first deploy | Log in on a **live URL** |
| 6 | Donor experience | Donor posts and manages listings in the browser |
| 7 | NGO experience | Map with pins; claim; handles "someone got it first" |
| 8 | Real-time | Two windows update live |
| 9 | Hardening, polish, buffer | Secured, responsive, impact counter, a few tests |
| 10 | Docs, demo, interview prep | README, demo video, pitch, mock interview |

### Time assumptions (read this honestly)

- The plan assumes **6 to 8 focused hours per day.** If you only have 3 to 4 hours, expect **18 to 20 days**, not 10. That is completely fine. Do not rush understanding.
- For a complete beginner, **Days 5, 8 and 9 are the most likely to overflow.** Day 9 contains a deliberate buffer. If you are still behind after that, use the **cut list** in Section 1 *before* you cut sleep or skip the explain-back steps.
- The explain-back and self-ask parts are not optional extras. They are the reason this plan produces someone who can discuss the project, not just someone who owns a repo.

### How each day is structured

Every day has the same sections, so you always know where you are:

1. **Goal**: what exists at the end of the day
2. **Time plan**: a suggested split of the hours
3. **Concepts to learn first**: with analogies
4. **Requirements before you start**: what must already be true
5. **Step-by-step actions**: numbered, in order
6. **Key code**: heavily commented
7. **Test it**: how to prove it works
8. 🧠 **Self-ask questions**: with collapsible hints
9. 🤖 **Use AI like this**: prompt ideas
10. ⚠️ **Common mistakes**
11. **Definition of done**: a checklist
12. **Git checkpoint**: what to commit
13. **Explain-back**: the 3-sentence summary you must be able to say
14. **Resources**: official docs

---

## 1. The Project at a Glance

### The problem

Restaurants, caterers, wedding halls and hostels often end the day with edible food they will throw away. Meanwhile, NGOs and shelters struggle to find surplus food in time. The food spoils in the gap between "available" and "found."

### The solution

**AnnaSeva** lets a **donor** post surplus food with a pickup window and location. Nearby **NGOs** see it on a map, **claim** it (only one NGO can win), and collect it before it expires. Everyone sees updates **live**.

### Users

| Role | Who | Core needs |
|---|---|---|
| **Donor** | Restaurant, caterer, hostel mess | Post food fast, see who claimed it, mark it picked up, cancel if plans change |
| **NGO** | Charity, shelter, community kitchen | See nearby food, claim it with confidence it is still available, find the pickup address |

### User stories (your feature checklist)

| # | As a... | I want to... | So that... |
|---|---|---|---|
| 1 | visitor | register as a donor or an NGO | I can use the right tools |
| 2 | user | log in and stay logged in | I don't retype my password constantly |
| 3 | donor | post a listing (what, how many, until when, where) | NGOs can find it |
| 4 | donor | see my listings and their status | I know what happened to my food |
| 5 | donor | mark a claimed listing as picked up | the record is accurate |
| 6 | donor | cancel a listing | NGOs don't travel for food that is gone |
| 7 | NGO | see available food near me, on a map and in a list | I can decide where to go |
| 8 | NGO | claim a listing | nobody else takes it |
| 9 | NGO | see my claims and get directions | I can collect the food |
| 10 | any user | see updates without refreshing | I'm never acting on stale information |
| 11 | visitor | see how many meals have been rescued | I trust the platform has impact |

### Non-functional requirements (how well it must work)

| Requirement | Meaning in AnnaSeva |
|---|---|
| **Correctness** | A listing can never be claimed by two NGOs |
| **Freshness** | Expired food never appears in search results |
| **Security** | Passwords are hashed; only donors create listings; only owners modify their listings |
| **Usability** | Works on a phone screen; clear loading, empty and error states |
| **Reliability** | A server error shows a friendly message, not a blank page |
| **Deployability** | A stranger can use it from a URL |

### Definition of success

> A stranger opens your URL, registers as a donor on a laptop, registers as an NGO on a phone, and watches a listing posted on one device appear and get claimed on the other within seconds. And **you can explain how every piece works.**

### In scope vs. out of scope

| In scope (MVP) | Out of scope (deliberately) |
|---|---|
| Two roles: donor and NGO | Volunteer / delivery role |
| Listings with location, expiry, status | Payments, ratings, reviews |
| Atomic claim | Chat between users |
| Map + list + radius search | Push notifications / email |
| Real-time updates (Socket.IO) | Admin panel and NGO verification |
| Deployment (Atlas + Render + Vercel) | Docker, CI/CD, TypeScript, Redis |

### The cut list: what to drop if you fall behind (drop from the top first)

1. Impact counter and landing-page polish
2. Automated tests (keep the race test)
3. Replace Socket.IO with **10-second polling** (a legitimate design choice; you can say so)
4. Radius filter UI (keep a fixed 10 km radius)
5. Map popups (keep plain pins)

**Never cut:** auth, the atomic claim, deployment, the README, and the explain-back sessions.

---

## 2. The Tech Stack and Why

### The restaurant analogy (keep this in your head all 10 days)

| Real piece | Restaurant analogy |
|---|---|
| Browser | The customer |
| React | The dining room: the menu, tables and what the customer sees |
| Express | The waiter: takes requests, brings back answers |
| Routes | The menu: what you're allowed to ask for |
| Controllers | The kitchen: where the work happens |
| Middleware | The host at the door: checks reservations before anyone sits |
| Models | The recipe book: what each dish must contain |
| MongoDB | The pantry: where ingredients (data) are stored |
| JWT | A wristband that proves you already passed the door check |
| Socket.IO | The kitchen bell: the kitchen *pushes* a notification without being asked |

### Stack table

| Technology | What it is (plain English) | Why we use it here | When you'd choose something else |
|---|---|---|---|
| **Node.js** | Lets JavaScript run on a server, not just in a browser | One language across the whole app; huge ecosystem | Python/Django, Java/Spring, Go for other teams or needs |
| **Express 5** | A small framework for receiving web requests and sending responses | Simple, the most common Node server framework, easy to explain | Fastify (speed), NestJS (large, structured teams) |
| **MongoDB Atlas** | A cloud database storing flexible JSON-like documents | Free tier; built-in **geospatial** ("find within 5 km") queries | PostgreSQL when data is strongly relational, with many joins and transactions |
| **Mongoose** | A helper that defines the *shape* of your data and talks to MongoDB | Gives you validation, schemas and readable queries | The raw MongoDB driver for maximum control |
| **React** | A library for building screens out of reusable components | Industry standard; component thinking transfers everywhere | Vue, Svelte, Angular |
| **Vite** | The tool that runs and builds your React app | Fast; the modern replacement for the old `create-react-app` | Next.js when you need server-side rendering and SEO |
| **React Router** | Shows different pages for different URLs inside one React app | Standard solution for multi-page feel | Next.js file-based routing |
| **Tailwind CSS** | Styling by adding small utility classes directly in your JSX | Fast to build; no separate CSS files to manage | Plain CSS / CSS Modules, or a component library such as MUI |
| **Axios** | A friendly tool for sending HTTP requests from React | Interceptors let you attach the login token in one place | The built-in `fetch` (fine too) |
| **JWT + bcryptjs** | JWT: a signed "wristband" proving who you are. bcrypt: scrambles passwords one-way | Stateless auth that scales; never store plain passwords | Sessions + cookies; managed auth (Auth0, Clerk, Firebase) |
| **Zod** | Describes what valid input looks like, then checks it | Never trust the client; clear, readable validation rules | express-validator, Joi |
| **Socket.IO** | Keeps an open connection so the server can *push* updates | The live demo moment; handles reconnection for you | Polling (simpler), Server-Sent Events (one-way) |
| **Leaflet + react-leaflet + OpenStreetMap** | An open-source map library plus free map tiles | Free, no credit card, no API key | Google Maps, Mapbox (nicer, but need keys and billing) |
| **helmet + express-rate-limit** | Safer HTTP headers; limits on repeated requests | Cheap, effective security basics | A reverse proxy or API gateway at larger scale |
| **Git + GitHub** | Save points for your code, and a cloud copy | Non-negotiable professional habit; your portfolio lives here | None. Everyone uses Git |
| **Render** | Hosts your Express server | Free tier; supports long-running servers and WebSockets | Railway, Fly.io, a VPS |
| **Vercel** | Hosts your React build | Free; excellent for Vite and React apps | Netlify, Cloudflare Pages |
| **Thunder Client** | A VS Code extension to test your API without a front end | Lets you prove the server works *before* building screens | Postman, Insomnia |

### Deliberately NOT in this project (and why)

| Skipped | Reason |
|---|---|
| **TypeScript** | Valuable, but it adds a second thing to learn. Add it in your *next* project. |
| **Redux / Zustand** | React Context is enough for "who is logged in" and "the socket". |
| **Docker** | Great skill, but not needed to deploy this app on Render and Vercel. |
| **Redis** | Only needed when you run multiple servers. Day 8 explains why. |
| **Next.js** | You're learning MERN. Next.js is a sensible follow-up. |
| **Microservices** | One small server is the correct design at this size. |

> **Honest note:** "Used fewer tools and can explain each one" beats "used twenty tools and can explain none."

### Versions this plan was checked against (October 2026)

You install the latest of everything with a plain `npm install`, so tutorials age quickly. The code in this plan was transcribed into a scratch project and built or run with:

| Piece | Version used |
|---|---|
| Node.js | 22 (24 is the current LTS; both work) |
| Express | 5.x |
| Mongoose | 9.x |
| Zod | 4.x |
| Socket.IO | 4.8.x |
| React / Vite / Tailwind CSS | React 19, Vite 8, Tailwind 4 |
| React Router | the `react-router` package (v7 and later; import from `react-router`, **not** `react-router-dom`) |
| react-leaflet | 5.x (needs React 19) |

**If an error mentions a function that "does not exist" or "is deprecated", first check which major version you installed.** Old blog posts and AI answers often describe Express 4, Zod 3, Tailwind 3 (which needed a `tailwind.config.js` file) or `react-router-dom`. Tell your AI assistant your exact versions (`npm ls express zod mongoose`) when you ask for help.

**What was and wasn't checked:** the server code was run end to end (registration, login, roles, validation, error handling, the claim endpoints and the Socket.IO events), the tests in Day 9 pass, and the whole React client builds and renders. The checks used a stand-in for the database, so the parts that depend on **real MongoDB behaviour** were *not* run: the atomic claim under 20 simultaneous requests, the `$near` geospatial search, and the index experiments on Day 4. You will run those yourself on Atlas on Days 3 and 4. If your real numbers differ from the "Expected" column, trust what you see, and check the official docs.

### Free-tier limits you should know before you design anything

| Service | Limit (as published by the provider, October 2026) | What it means for AnnaSeva |
|---|---|---|
| **MongoDB Atlas Free** | 0.5 GB of data (documents plus indexes), 500 connections, about 100 operations per second (extra requests are throttled) | Fine for a demo. Don't bulk-load huge datasets or run load tests against it |
| **Render Free web service** | Spins down after **15 minutes** without inbound traffic; waking takes about **1 minute**; **750 free instance hours per month** for the whole workspace | The first request after a quiet period is slow. Open the app 2 minutes before a demo. Since February 2026, WebSocket messages on an open connection also count as traffic |
| **Vercel Hobby** | Generous for static sites | The React app itself is never the bottleneck |

Provider limits change. Re-check [Render's free tier page](https://render.com/docs/free) and [Atlas free cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/) before a real launch.

### Decision: ES Modules on the server

Older Node tutorials use `require()` (CommonJS). This plan uses `import` (ES Modules) on **both** server and client, so you learn **one** syntax. The only differences you'll meet: add `"type": "module"` to `server/package.json`, and always write the `.js` extension in relative imports (`import app from './app.js'`).

---

## 3. Architecture

### The big picture

```
┌───────────────────────┐        HTTPS (JSON)         ┌────────────────────────┐        ┌──────────────────┐
│  Browser              │ ─────────────────────────▶ │  Express API           │ ─────▶ │  MongoDB Atlas   │
│  React app (Vercel)   │ ◀───────────────────────── │  Node.js (Render)      │ ◀───── │  (database)      │
└───────────┬───────────┘                             └───────────┬────────────┘        └──────────────────┘
            │                                                     │
            └──────────── WebSocket (Socket.IO) ◀─────────────────┘
                     server pushes "listing:new", "listing:updated"
```

### Inside the Express server: the life of one request

```
Request ─▶ helmet ─▶ cors ─▶ express.json ─▶ rate-limit ─▶ ROUTER
                                                             │
                   ┌─────────────────────────────────────────┘
                   ▼
           protect (is the token valid?)
                   ▼
           restrictTo('ngo') (is this the right role?)
                   ▼
           validate(schema) (is the input well-formed?)
                   ▼
           controller (do the work with the database, emit socket events)
                   ▼
           Response (JSON)        ... or any thrown error ─▶ errorHandler ─▶ JSON error
```

Each box is a small function with one job. Chaining them is called the **middleware pattern**.

### The life of "NGO clicks Claim" (memorise this; it's your interview answer)

1. The NGO clicks **Claim** in React.
2. React calls `api.patch('/listings/:id/claim')`. Axios attaches `Authorization: Bearer <token>`.
3. Express receives it; `protect` verifies the token and sets `req.user`.
4. `restrictTo('ngo')` confirms the role.
5. The controller runs **one atomic database operation**: "set status to claimed *only if* it is still available and not expired."
6. If a document matched, this NGO won. If not, someone was faster (or it expired), so the server responds **409 Conflict**.
7. On success, the server emits a `listing:updated` socket event.
8. Every NGO's screen removes the listing; the donor's screen shows "claimed by ...".
9. The winning NGO's React app updates its state and shows the pickup address.

### Deployment picture

```
GitHub repo (main branch)
   ├── /client  ──▶ Vercel  (builds Vite, serves static files, https://annaseva.vercel.app)
   └── /server  ──▶ Render  (runs `npm start`, https://annaseva-api.onrender.com)
                        └──▶ MongoDB Atlas (database users + network allow-list)
```

---

## 4. Data Model and API

### Two collections (a collection is like a spreadsheet tab; a document is one row)

**`users`**

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | created by MongoDB |
| `name` | String | required |
| `email` | String | required, unique, lowercase |
| `password` | String | **hashed**, `select: false` so it is never returned by accident |
| `role` | `'donor'` or `'ngo'` | required. `admin` is *not* possible through the API |
| `organization` | String | optional display name |
| `createdAt`, `updatedAt` | Date | automatic |

**`listings`**

| Field | Type | Notes |
|---|---|---|
| `title` | String | 3 to 100 chars |
| `description` | String | optional, up to 500 chars |
| `foodType` | `'veg'`, `'non-veg'`, `'vegan'`, `'mixed'` | required |
| `quantity` | Number | meals/portions, 1 to 10000 |
| `preparedAt` | Date | food-safety context |
| `expiresAt` | Date | must be in the future; at most 24 h ahead |
| `pickupAddress` | String | human-readable address |
| `location` | GeoJSON Point | `{ type: 'Point', coordinates: [longitude, latitude] }` |
| `donor` | ObjectId → `users` | who posted it |
| `status` | `'available'`, `'claimed'`, `'completed'`, `'cancelled'` | default `available` |
| `claimedBy` | ObjectId → `users` | null until claimed |
| `claimedAt`, `completedAt` | Date | set on transitions |

> **Design decision:** "expired" is **not stored.** A listing is *expired* when `status === 'available'` and `expiresAt < now`. We compute it in queries, so no cron job is needed.

### The status state machine

```
                          cancel (donor)
              ┌────────────────────────────────────┐
              │                                    ▼
 [available] ─┴─ claim (ngo, atomic) ─▶ [claimed] ─ complete (donor) ─▶ [completed]
      │                                    │
      │                                    └─ cancel (donor) ─▶ [cancelled]
      └─ (expiresAt passes) ─▶ shown as "expired" (computed, not stored)
```

Write the legal transitions down. A state machine you can draw is a design you understand.

### REST API

| Method | URL | Who | Purpose | Success |
|---|---|---|---|---|
| GET | `/api/health` | anyone | is the server alive? | 200 |
| POST | `/api/auth/register` | anyone | create account | 201 |
| POST | `/api/auth/login` | anyone | get a token | 200 |
| GET | `/api/auth/me` | logged in | who am I? | 200 |
| POST | `/api/listings` | donor | create listing | 201 |
| GET | `/api/listings/mine` | donor | my listings | 200 |
| GET | `/api/listings/nearby?lat=&lng=&radiusKm=` | NGO | available listings near me | 200 |
| GET | `/api/listings/claimed` | NGO | my claims | 200 |
| PATCH | `/api/listings/:id/claim` | NGO | claim (atomic) | 200 / 409 |
| PATCH | `/api/listings/:id/complete` | donor (owner) | mark picked up | 200 |
| PATCH | `/api/listings/:id/cancel` | donor (owner) | cancel | 200 |
| GET | `/api/stats` | anyone | meals rescued | 200 |

### Socket.IO events (server to client)

| Event | Sent to | Payload | Meaning |
|---|---|---|---|
| `listing:new` | room `ngos` | the new listing | something new to claim |
| `listing:updated` | room `ngos` + `user:<donorId>` + `user:<claimedById>` | the updated listing | status changed |

### Who can do what

| Action | Visitor | Donor | NGO |
|---|:-:|:-:|:-:|
| Register / login | yes | yes | yes |
| Create listing | no | **yes** | no |
| Search nearby | no | no | **yes** |
| Claim | no | no | **yes** |
| Complete / cancel | no | **own only** | no |
| View stats | yes | yes | yes |

---

## 5. File Structure

### The full tree (you will create it gradually, not on day one)

```
annaseva/
├── .gitignore                    # tells Git which files to ignore (secrets, node_modules)
├── README.md                     # the front door of the project (written on Day 10)
├── docs/
│   ├── plan.md                   # this file
│   ├── requirements.md           # functional + non-functional requirements
│   ├── decisions.md              # "I chose X over Y because..." (interview gold)
│   └── journal.md                # your daily self-ask answers and notes
│
├── server/                       # everything behind the scenes (Node + Express)
│   ├── .env                      # SECRETS. Never commit.
│   ├── .env.example              # same keys, fake values. Safe to commit.
│   ├── package.json              # project manifest: dependencies and scripts
│   ├── server.js                 # entry point: connects DB, creates HTTP + socket server
│   ├── app.js                    # builds the Express app (middleware + routes), no listening
│   ├── config/
│   │   └── db.js                 # connects to MongoDB
│   ├── models/
│   │   ├── User.js               # shape of a user
│   │   └── Listing.js            # shape of a listing + the geo index
│   ├── routes/                   # the "menu": which URL leads where
│   │   ├── auth.routes.js
│   │   ├── listing.routes.js
│   │   └── stats.routes.js
│   ├── controllers/              # the "kitchen": the logic for each route
│   │   ├── auth.controller.js
│   │   ├── listing.controller.js
│   │   └── stats.controller.js
│   ├── middleware/               # the "door checks"
│   │   ├── auth.js               # protect + restrictTo
│   │   ├── validate.js           # runs a Zod schema
│   │   ├── validateId.js         # checks :id looks like a real id
│   │   ├── rateLimit.js          # request limits (Day 9)
│   │   └── error.js              # notFound + errorHandler
│   ├── validators/               # Zod schemas: what valid input looks like
│   │   ├── auth.schema.js
│   │   └── listing.schema.js
│   ├── sockets/
│   │   ├── index.js              # sets up Socket.IO + socket auth + rooms
│   │   └── emit.js               # helper to broadcast listing changes
│   ├── utils/
│   │   └── generateToken.js
│   ├── scripts/                  # one-off tools you run by hand
│   │   ├── seed.js               # fill the DB with demo data
│   │   ├── race-test.js          # fire many claims at once
│   │   ├── explain-lab.js        # see how indexes change query plans
│   │   ├── rate-limit-check.js   # prove the login limiter works (Day 9)
│   │   └── cleanup-demo.js       # remove demo accounts and their listings (Day 10)
│   └── tests/
│       ├── validators.test.js    # Zod rules (Day 9)
│       └── api.test.js           # the Express app over real HTTP, no database (Day 9)
│
└── client/                       # everything the user SEES (React)
    ├── .env                      # VITE_API_URL, VITE_SOCKET_URL (not secrets, but local config)
    ├── .env.example
    ├── index.html                # the one HTML page React mounts into
    ├── vercel.json               # makes page refreshes work on Vercel
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx              # starts React, wraps the app in providers
        ├── App.jsx               # the route table: which page for which URL
        ├── index.css             # imports Tailwind
        ├── leafletSetup.js       # fixes the default map marker icons
        ├── context/
        │   ├── AuthContext.jsx   # "who is logged in" shared everywhere
        │   └── SocketContext.jsx # the live connection shared everywhere
        ├── services/
        │   └── api.js            # the one place that talks to the server
        ├── hooks/
        │   └── useGeolocation.js # reusable "get my location" logic
        ├── utils/
        │   ├── format.js         # dates, countdowns, status labels
        │   ├── geo.js            # distance maths
        │   └── errors.js         # turn server errors into readable text
        ├── components/           # reusable pieces
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ListingCard.jsx
        │   ├── ListingMap.jsx
        │   ├── StatusBadge.jsx
        │   ├── Loader.jsx
        │   ├── ErrorMessage.jsx
        │   ├── EmptyState.jsx
        │   └── Notice.jsx
        └── pages/                # one file per screen
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── DonorDashboard.jsx
            ├── NewListing.jsx
            ├── NgoNearby.jsx
            ├── MyClaims.jsx
            └── NotFound.jsx
```

### Why it's organised this way

| Rule | Reason |
|---|---|
| **`client/` and `server/` are separate projects** | They have different dependencies and deploy to different hosts |
| **`routes` / `controllers` / `models` are separate** | Each file has one job; bugs are easier to locate |
| **`app.js` is separate from `server.js`** | `app.js` can be imported by tests without opening a port |
| **`pages` vs `components`** | A *page* is a whole screen; a *component* is a reusable piece used by pages |
| **All server calls live in `services/api.js`** | Change the base URL or auth header in one place, not in 20 files |
| **`.env` is never committed** | Secrets in a public repo are scraped by bots within minutes |

### Naming conventions

- Files that export a React component: `PascalCase.jsx` (`ListingCard.jsx`)
- Everything else: `camelCase.js` or `kebab-case`, but **be consistent**. Use exact capitalisation in every import: Vercel runs Linux, where `Navbar.jsx` and `navbar.jsx` are *different* files.
- Variables describe their content: `claimedListings`, not `data2`.

---

## 6. Pre-Flight Setup

Do this **before Day 1** (about 1 to 2 hours). Nothing here is optional, and every item removes a future "why doesn't this work?" afternoon.

### 6.1 Install

| Tool | Where | Verify with | Expected |
|---|---|---|---|
| **Node.js (current LTS)** | nodejs.org (click the **LTS** button) | `node -v` | **v22 or higher** (v24 LTS is ideal). v20 is past end-of-life and current Vite needs a newer Node |
| **npm** (comes with Node) | n/a | `npm -v` | any recent number |
| **Git** | git-scm.com | `git --version` | any recent number |
| **VS Code** | code.visualstudio.com | open it | n/a |

**VS Code extensions to install:**

| Extension | Why |
|---|---|
| **ESLint** | underlines likely bugs while you type |
| **Prettier** | auto-formats code so it's consistently readable |
| **Thunder Client** | test your API from inside VS Code |
| **Tailwind CSS IntelliSense** | autocompletes Tailwind class names |
| **ES7+ React/Redux snippets** (optional) | typing shortcuts such as `rafce` |

Turn on "Format on Save" in VS Code settings. It saves you from arguing with indentation.

### 6.2 Accounts (all have free tiers)

- [ ] **GitHub** (your code and portfolio)
- [ ] **MongoDB Atlas** (database)
- [ ] **Render** (server hosting). Sign up *with GitHub*.
- [ ] **Vercel** (front-end hosting). Sign up *with GitHub*.

### 6.3 Terminal basics (if you've never used one)

The terminal is a text window where you give the computer written commands. Use VS Code's built-in terminal: **Terminal menu > New Terminal**.

| Command | Meaning | Example |
|---|---|---|
| `pwd` | print working directory ("where am I?") | `pwd` |
| `ls` | list files in this folder | `ls` |
| `cd <folder>` | go into a folder | `cd server` |
| `cd ..` | go up one folder | `cd ..` |
| `mkdir <name>` | make a folder | `mkdir docs` |
| `touch <file>` | make an empty file | `touch notes.md` |
| `Ctrl + C` | stop the program running in the terminal | n/a |

> **Windows users:** use **Git Bash** (installed with Git) or VS Code's PowerShell. A few commands differ:
> `cp` is `copy` in PowerShell, and `touch` is `New-Item <file>`. Creating files from VS Code's file explorer works everywhere.

### 6.4 Two terminals, always

From Day 1 onward you will usually keep **two terminals** open: one running the server (`cd server`), one running the client (`cd client`, from Day 5). Name them in VS Code so you don't mix them up.

### 6.5 Pre-flight checklist

- [ ] `node -v`, `npm -v`, `git --version` all print version numbers
- [ ] VS Code and the extensions are installed
- [ ] GitHub, Atlas, Render and Vercel accounts exist
- [ ] You created a folder named `annaseva` somewhere easy to find (not inside OneDrive/Dropbox sync folders, which can corrupt `node_modules`)
- [ ] You created `annaseva/docs/journal.md` (see Section 10 for the template)

---

## 7. Git and GitHub Crash Course

### 7.1 🟢 What is Git?

**Analogy:** Git is the **save-point system in a video game**, plus a time machine. You can save when things work, experiment recklessly, and return to the last good save if you break something. **GitHub** is the cloud backup of those saves, and it doubles as your public portfolio.

### 7.2 🟢 The three areas (this explains 90% of Git confusion)

```
  Working folder         Staging area            Repository (history)
  (files you edit)  ──▶  (files chosen for  ──▶  (permanent save points)
                          the next save)
        git add <file>            git commit -m "message"
```

**Analogy:** you spread items on a table (your edited files), choose which go in the box (`git add`), then seal and label the box (`git commit`). The label is your commit message.

### 7.3 🟢 One-time setup

```bash
# Tell Git who you are. This name/email appears on every commit you make.
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Make "main" the default branch name for new repos.
git config --global init.defaultBranch main
```

### 7.4 🟢 The commands you'll use every day

| Command | What it does | Analogy |
|---|---|---|
| `git init` | Turns the current folder into a Git repo | Start a new game save file |
| `git status` | Shows what changed and what's staged | "What's on the table?" |
| `git add .` | Stages **all** changes | Put everything in the box |
| `git add <file>` | Stages one file | Put one item in the box |
| `git commit -m "msg"` | Saves a snapshot with a label | Seal and label the box |
| `git log --oneline` | Shows the list of save points | The save list |
| `git diff` | Shows exact line-by-line changes | "What did I change?" |
| `git switch -c <name>` | Creates and switches to a new branch | Open a parallel timeline |
| `git switch <name>` | Switches branch | Jump to another timeline |
| `git merge <name>` | Brings another branch's work into the current one | Merge timelines |
| `git push` | Uploads your commits to GitHub | Back up to the cloud |
| `git pull` | Downloads new commits from GitHub | Restore from the cloud |

### 7.5 🟢 First-time repo setup (Day 1 will walk you through this)

```bash
cd annaseva
git init

# BEFORE your first commit, create .gitignore (see 7.7).
git add .
git commit -m "chore: initial project structure"

# Create an EMPTY repo on github.com (no README), then connect it:
git branch -M main
git remote add origin https://github.com/<your-username>/annaseva.git
git push -u origin main      # -u remembers the link, so later you can just type "git push"
```

### 7.6 🟡 Branch workflow (simple version for solo work)

| Branch | Purpose |
|---|---|
| `main` | Always working. Never half-broken. This is what you deploy. |
| `feature/<name>` | One branch per chunk of work, e.g. `feature/auth`, `feature/claim` |

```bash
git switch -c feature/auth           # 1. start a branch
# ...write code, test it...
git add .
git commit -m "feat(auth): add register and login"   # 2. commit often (several times per day)
git switch main                      # 3. go back to main
git merge feature/auth               # 4. bring the work in
git push                             # 5. back it up
git branch -d feature/auth           # 6. delete the finished branch
```

> **Why bother with branches when you're alone?** Because you can break things on a branch with zero fear, and because interviewers ask about your workflow. Optional extra: push the branch and open a **Pull Request** on GitHub, then merge it there. It builds the habit you'll use at work.

### 7.7 🟢 `.gitignore`: files Git must never track

Create this file at the **repo root** *before* your first commit:

```gitignore
# Dependencies: huge, and recreated by "npm install"
node_modules/

# Secrets and local config: NEVER commit these
.env
.env.*
# ...but DO commit the example file (it holds fake values). The "!" means "except".
!.env.example

# Build output: generated, not written by you
dist/
build/

# Operating system and editor clutter
.DS_Store
Thumbs.db
*.log
.vscode/
```

> ⚠️ **A `#` comment must be on its own line in `.gitignore`.** If you write `!.env.example   # my note` on one line, Git treats the whole thing as the pattern, the "except" rule silently stops matching, and `.env.example` stays ignored forever. **Check it:** after you create `.env` and `.env.example`, run `git status`. `.env` must **not** appear; `.env.example` **must** appear as a new file.

### 7.8 🟢 Commit message convention

Format: `type(scope): short description in present tense`

| Type | Use for | Example |
|---|---|---|
| `feat` | a new feature | `feat(listings): add nearby search` |
| `fix` | a bug fix | `fix(map): swap lat/lng order for markers` |
| `docs` | documentation only | `docs: add README screenshots` |
| `refactor` | restructuring without changing behaviour | `refactor: move validation to middleware` |
| `test` | adding tests | `test: add race-condition script` |
| `chore` | setup, config, dependencies | `chore: add .gitignore` |

Good commits are **small** and **do one thing**. "Day 3 stuff" is a bad message. "feat(listings): add create endpoint with validation" is a good one.

### 7.9 🟡 Undo cheat sheet

| Situation | Command |
|---|---|
| Discard unsaved edits to a file | `git restore <file>` |
| Unstage a file (keep the edits) | `git restore --staged <file>` |
| Undo the last commit, keep the changes | `git reset --soft HEAD~1` |
| Safely undo an already-pushed commit | `git revert <commit-hash>` |
| Park unfinished work temporarily | `git stash`, then later `git stash pop` |
| See history as a picture | `git log --oneline --graph --all` |

### 7.10 ⚠️ "I committed my `.env` by accident"

1. **Treat every secret in it as leaked.** Change the MongoDB database-user password and generate a new `JWT_SECRET` *now*. This is the real fix.
2. Stop tracking the file: `git rm --cached server/.env`, then commit.
3. (Optional, advanced) Rewriting history to erase it is possible, but rotating the secrets matters more. Bots scan GitHub constantly.

### 7.11 Daily Git routine

- [ ] Morning: `git switch main && git pull`, then `git switch -c feature/<today's work>`
- [ ] Every working slice: `git add . && git commit -m "..."`
- [ ] Evening: merge into `main`, `git push`, check the GitHub page shows your commits

---

## 8. Web Basics You Need

### 8.1 🟢 What happens when you open a website

1. You type a URL. The browser finds the server's address.
2. The browser sends an **HTTP request**: "please give me this."
3. The server runs code, maybe reads a database, and sends back an **HTTP response**.
4. The browser shows the result. Repeat for every click.

**Analogy:** a restaurant order. You (browser) ask the waiter (server) for something, and the waiter returns with a dish (response), or with an apology.

### 8.2 🟢 Anatomy of a URL

```
https://api.annaseva.com:443/api/listings/nearby?lat=18.52&lng=73.85
└──┬──┘ └────────┬────────┘└┬┘ └──────────┬──────┘ └────────┬───────┘
protocol       host      port           path           query string
```

Locally you'll use `http://localhost:5000`. **localhost** means "this computer" and **5000** is the "door number" (port) your server listens on.

### 8.3 🟢 Request and response

| Part | Request (browser to server) | Response (server to browser) |
|---|---|---|
| Line 1 | **Method + path** (`GET /api/listings`) | **Status code** (`200 OK`) |
| Headers | extra info (`Authorization: Bearer ...`, `Content-Type: application/json`) | extra info (`Content-Type`, CORS headers) |
| Body | data you send (for `POST`/`PATCH`) | data you receive, usually JSON |

### 8.4 🟢 HTTP methods

| Method | Meaning | AnnaSeva example |
|---|---|---|
| `GET` | read something | list nearby listings |
| `POST` | create something | register, create a listing |
| `PATCH` | change *part* of something | set status to claimed |
| `PUT` | replace something entirely | (not used here) |
| `DELETE` | remove something | (we cancel instead of delete, to keep history) |

### 8.5 🟢 Status codes (learn these eight)

| Code | Name | Meaning | When AnnaSeva returns it |
|---|---|---|---|
| 200 | OK | worked | most successful reads/updates |
| 201 | Created | a new thing now exists | after register / create listing |
| 400 | Bad Request | your input is invalid | validation failed |
| 401 | Unauthorized | **who are you?** (not logged in / bad token) | missing or expired token |
| 403 | Forbidden | I know who you are; you're **not allowed** | an NGO tries to create a listing |
| 404 | Not Found | no such thing | unknown listing id |
| 409 | Conflict | the state changed under you | listing already claimed |
| 500 | Server Error | the server's fault | an unexpected crash |

**Rule of thumb:** 4xx means *the caller* made a mistake. 5xx means *the server* did.

### 8.6 🟢 JSON

JSON is the text format that front end and back end use to exchange data:

```json
{
  "title": "Veg biryani",
  "quantity": 20,
  "available": true,
  "location": { "type": "Point", "coordinates": [73.85, 18.52] },
  "tags": ["veg", "hot"]
}
```

Rules: keys are in double quotes; no trailing commas; values are strings, numbers, booleans, `null`, arrays, or objects.

### 8.7 🟢 What is an API and what is REST?

- **API:** a menu of requests a server agrees to answer. AnnaSeva's API is the table in Section 4.
- **REST:** a *style* for designing that menu: URLs are **nouns** (`/listings`), methods are **verbs** (`GET`, `POST`), and responses use status codes plus JSON.
- Our `PATCH /listings/:id/claim` is a pragmatic "action" endpoint for a state change. Real-world REST APIs do this often.

### 8.8 🟢 Environment variables (`.env`)

Values that change between your laptop and the live server (database address, secret keys) live **outside the code**, in environment variables.

- Locally: a `.env` file (never committed).
- On Render/Vercel: typed into the dashboard.
- In code: `process.env.MONGO_URI` (server) and `import.meta.env.VITE_API_URL` (Vite client).

**Analogy:** a hotel safe. The room (code) is the same for every guest, but each guest brings their own valuables (secrets).

### 8.9 🟢 npm, `package.json` and `node_modules`

| Thing | What it is |
|---|---|
| **npm** | Node's package manager: a store of reusable code you install with one command |
| **`package.json`** | Your project's ID card: name, scripts and the list of dependencies |
| **`node_modules/`** | The folder where installed packages live. Huge. Never commit. |
| **`package-lock.json`** | Records the exact versions installed. Commit this. |
| `npm install <pkg>` | Adds a package to dependencies |
| `npm install -D <pkg>` | Adds a **dev** dependency (only needed while developing) |
| `npm run <script>` | Runs a script defined in `package.json` (e.g. `npm run dev`) |

### 8.10 🟢 JavaScript you must be comfortable with

Don't try to memorise everything; keep this table nearby.

| Concept | Example | Plain English |
|---|---|---|
| `const` / `let` | `const name = 'Asha'` | `const` can't be reassigned; use `let` when it must change |
| Arrow function | `const double = (n) => n * 2` | a short way to write a function |
| Template string | `` `Hello ${name}` `` | insert variables into text |
| Destructuring | `const { email, password } = req.body` | pull named values out of an object |
| Spread | `{ ...old, title: 'New' }` | copy an object, then change one field |
| Optional chaining | `error.response?.status` | safely read a value that might not exist |
| `map` | `ids.map(id => id * 2)` | transform every item, get a new array |
| `filter` | `items.filter(i => i.status === 'available')` | keep only items that pass a test |
| `find` / `some` | `items.find(i => i._id === id)` | first match / "does any item match?" |
| Promise / `async` / `await` | `const res = await api.get('/x')` | wait for a slow thing (network, database) to finish |
| `try / catch / finally` | see below | handle failures and always clean up |

**Async analogy:** you order food and get a buzzer. You don't stand frozen at the counter. `await` means "pause *this function* until the buzzer rings", while the rest of the program keeps working.

```js
async function loadListings() {
  try {
    const { data } = await api.get('/listings/mine'); // wait for the server
    console.log('Got listings:', data);                // console.log = your best debugging friend
  } catch (error) {
    console.error('Could not load:', error.message);   // runs if anything above throws
  } finally {
    console.log('Always runs, e.g. hide the loading spinner');
  }
}
```

### 8.11 🟢 Frontend, backend, database in one sentence each

- **Frontend (client):** what runs in the user's browser. React.
- **Backend (server):** what runs on your machine/host and holds the rules. Express.
- **Database:** where data survives when the server restarts. MongoDB.

> **Golden rule:** the browser is **untrusted**. Anyone can open DevTools and send any request they like. All real checks (who are you, are you allowed, is this valid) happen on the **server**. The front-end checks only make the app *pleasant*.

---

## 9. Working With AI

### 9.1 The role of AI in this plan

AI is your **tutor, pair-programmer and code reviewer**. It is not your replacement. A beginner who pastes code they don't understand finishes quickly and then can't answer the first interview follow-up.

### 9.2 Eight rules

1. **Concept first, code second.** Ask for the explanation and analogy *before* the code.
2. **Small pieces.** One route, one component, one function. Never "build my whole backend."
3. **Try first.** Write your own attempt, even a bad one, then ask the AI to review it. You learn far more from comparing.
4. **Explain every line.** If you can't explain a line, ask "what does this do and why is it needed?" until you can. Don't commit what you can't explain.
5. **Give context with errors.** Paste: the exact error, the file, what you expected, what you tried.
6. **Verify against official docs.** AI sometimes uses outdated or invented APIs. For anything surprising, check MDN or the library's docs.
7. **Never paste secrets.** No `.env` contents, connection strings, tokens or passwords. Replace them with placeholders.
8. **Keep an AI log** in `docs/journal.md`: prompt, what you changed, what you learned. In interviews, "how did you use AI?" is a real question, and a good log is a great answer.

### 9.3 Prompt templates

**Learn a concept**
```
I'm a beginner building AnnaSeva (MERN). I need to understand: [concept].
1. Explain it in simple words with a real-world analogy.
2. Show the smallest working example, with comments explaining WHAT and WHY.
3. List 2 common beginner mistakes.
4. Ask me 3 questions to check my understanding. Wait for my answers before continuing.
```

**Build one slice**
```
I'm on Day [N] of AnnaSeva. Task: [one small task].
Here is my current file: [paste code].
Show me only the change needed, explain each line, and tell me how to test it.
Do not rewrite unrelated parts.
```

**Debug**
```
I expected [X] but got [Y].
Error (exact text): [paste]
File: [name + relevant code]
What I already tried: [list]
Explain the error in plain English first, then help me find the cause myself with hints.
Only give the full fix if I ask.
```

**Review my attempt**
```
Here's my attempt at [feature]: [paste].
Review it like a senior developer: correctness, security, readability, naming.
Rank the issues by importance. Don't rewrite it. Point and explain.
```

**Explain-back check**
```
I'll explain [feature] in my own words. Tell me what I got right, what I got wrong,
and what an interviewer might follow up with. Be direct.
[your explanation]
```

### 9.4 Signs AI code needs a second look

| Red flag | What to do |
|---|---|
| Uses a package or function you can't find in the docs | It may be invented. Check npm / the official docs. |
| Uses very old patterns (`create-react-app`, `body-parser`, deprecated Mongoose options) | Ask for the current recommended way and compare with the docs. |
| Hard-codes secrets or URLs | Move them to `.env`. |
| No error handling, no input validation | Add both. |
| Much more code than the problem needs | Ask for the simplest version. |
| "It works" but you can't say why | Not done. Go back to rule 4. |

---

## 10. Daily Rhythm and Getting Unstuck

### 10.1 Suggested daily schedule (about 7 hours)

| Block | Time | What |
|---|---|---|
| Learn | 60 to 90 min | Read the day's **Concepts**. Ask AI for an analogy and 3 quiz questions. |
| Build 1 | 2 to 2.5 h | First half of the **Step-by-step actions** |
| Break | 45 to 60 min | Real break. Walk. Do not scroll. |
| Build 2 | 2 h | Second half of the actions |
| Test + Git | 30 min | Run the **Test it** list. Commit. |
| Reflect | 45 to 60 min | 🧠 Self-ask questions, **Explain-back**, update the journal |

If something takes longer, shrink Build 2 first. **Never skip Reflect.**

### 10.2 The 20-minute rule (getting unstuck)

When stuck, go in this order. Spend about 20 minutes on 1 to 5 before asking for a full solution.

1. **Read the error** from the top. The first line and the first line mentioning *your* file matter most.
2. **Make the problem smaller.** Comment things out until the smallest failing piece remains.
3. **Look with your own eyes.** `console.log` values. Check the Network tab. Look in Atlas.
4. **Search the exact error text** (remove file paths first).
5. **Ask AI** with the context template from Section 9.
6. **Step away for 10 minutes.** It works more often than you'd think.
7. **If you're lost:** `git status`, then `git restore` or return to the last good commit and re-approach the problem.

### 10.3 Debugging toolbox

| Tool | Use it to |
|---|---|
| **Server terminal** | Read errors and your `console.log` output |
| **Thunder Client** | Test an endpoint *without* the front end involved |
| **Browser DevTools > Console** | See front-end errors |
| **Browser DevTools > Network** | See each request: URL, status, payload, response. For sockets, open the **WS** filter. |
| **React DevTools** (browser extension) | Inspect component state and props |
| **Atlas > Browse Collections** | See what's *actually* in the database |
| **jwt.io** | Decode a token to see its (non-secret) contents |

**Debugging in a sentence:** find *which layer* is wrong. Does the database hold what you expect? Does the API return it correctly in Thunder Client? Does the front end receive it (Network tab)? Does the component show it? The first "no" is where the bug lives.

### 10.4 Journal template (`docs/journal.md`)

```md
## Day N: <title>   (date)

**Hours worked:**
**What I built:**
**What confused me:**
**Errors I hit and how I fixed them:**
**AI log:** prompt -> what I changed -> what I learned
**Self-ask answers:** (write them here, without looking at the code)
**Explain-back (3 sentences):**
**Tomorrow's first task:**
```

### 10.5 Weekly honesty check (Day 5 and Day 9)

Ask yourself:

- Am I writing code I can't explain? If yes, slow down and do an extra explain-back session.
- Am I behind schedule? If yes, use the **cut list** (Section 1), not your sleep.
- Is my `main` branch always working? If not, fix that before adding features.

---

## Day 1: Foundations, Git and the First Server

### Goal

By the end of today:

- The repo exists on GitHub with a correct `.gitignore`.
- `server/` runs an Express app and `GET /api/health` returns JSON.
- MongoDB Atlas is created and your server connects to it.
- You can explain what a server, a route, middleware and an environment variable are.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1.5 h | Concepts below; re-read Sections 7 and 8 |
| Build 1 | 2 h | Steps A and B (repo, Express) |
| Build 2 | 2 h | Steps C and D (Atlas, connection) |
| Test + Git | 30 min | Thunder Client test, commits |
| Reflect | 1 h | Self-ask, journal, requirements doc |

### Concepts to learn first

1. 🟢 **A server is a program that waits.** It listens on a *port* (a numbered door) and answers requests. **Analogy:** a waiter standing by the kitchen window, waiting for orders.
2. 🟢 **A route** pairs a method and a path with a function: "when someone does `GET /api/health`, run this."
3. 🟢 **`req` and `res`.** `req` is the order slip (what was asked). `res` is the tray you send back (the answer).
4. 🟢 **Middleware** is a function that runs *between* the request arriving and your route handling it. `express.json()` is middleware that reads JSON bodies so `req.body` works. **Analogy:** the host at the door who checks something before you reach your table.
5. 🟢 **MongoDB vocabulary.** *Cluster* = the database computer(s) in the cloud. *Database* = a folder. *Collection* = a spreadsheet tab (like `users`). *Document* = one row, stored as JSON-like data.
6. 🟢 **Environment variables.** Secrets and settings stay out of code. Locally they live in `.env`, loaded by the `dotenv` package.
7. 🟡 **Why `app.js` and `server.js` are separate.** `app.js` builds the app. `server.js` starts listening. Keeping them apart lets you test the app without opening a port, and (Day 8) attach Socket.IO to the HTTP server.

### Requirements before you start

- [ ] Pre-flight checklist (Section 6.5) is fully ticked
- [ ] You can open a terminal in VS Code in your `annaseva` folder

### Step-by-step actions

#### A. Repo and project skeleton

1. In the `annaseva/` folder, create the sub-folders: `server`, `client`, `docs`.
2. Create `.gitignore` at the repo root using the content from **Section 7.7** *before* anything else.
3. Create `README.md` with a title and one sentence ("AnnaSeva connects surplus food to NGOs."). You'll expand it on Day 10.
4. Copy this file to `docs/plan.md`.
5. Initialise Git and make your first commit:
   ```bash
   git init
   git add .
   git commit -m "chore: initial project structure and gitignore"
   ```
6. Create an **empty** repository on github.com (name: `annaseva`, no README, no .gitignore). Connect and push using Section 7.5.
7. Refresh GitHub in your browser. You should see your files, and **no** `.env` or `node_modules`.

#### B. The Express server

8. Create a branch: `git switch -c feature/server-setup`
9. Set up the server project:
   ```bash
   cd server
   npm init -y
   npm install express mongoose dotenv cors
   ```
   *Why each:* `express` (web framework), `mongoose` (database helper), `dotenv` (loads `.env`), `cors` (lets your browser app talk to this server; explained on Day 5).
10. Open `server/package.json` and make two edits: add `"type": "module"` and replace `scripts` as shown in **Key code**.
11. Create these files and folders: `server.js`, `app.js`, `config/db.js`, `.env`, `.env.example` (contents below).
12. Run `npm run dev`. You should see "Server running..." (and a DB error until Step C is done, which is expected).

#### C. MongoDB Atlas

13. In Atlas, create a project, then **Create a cluster** and choose the **free (M0)** tier. Pick the cloud region **closest to you**.
14. **Security Quickstart / Database Access:** create a *database user* (a username and password just for this app). Use a password with letters and numbers only, or special characters will need URL-encoding in the connection string. This is **not** your Atlas login password.
15. **Network Access:** click *Add IP Address > Add Current IP Address*. (On Day 5 you'll also allow `0.0.0.0/0` so Render can connect, because Render's free tier has no fixed IP address.)
16. **Connect > Drivers:** copy the connection string. It looks like `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/`.
17. Edit it: replace `<user>` and `<password>`, and add a database name **before the `?`**: `.../annaseva_dev?retryWrites=true&w=majority`.
    > **Why `_dev`?** You'll use a *separate* database for production (`annaseva`). Then your experiments and seed scripts can never wreck live data.
18. Paste it into `server/.env` as `MONGO_URI`.

#### D. Connect and test

19. Restart the server (`Ctrl + C`, then `npm run dev`). Expect `MongoDB connected: ...` followed by the server message.
20. Test `GET http://localhost:5000/api/health` in **both** the browser and Thunder Client. Compare: the browser just displays JSON, while Thunder Client lets you see headers and status.
21. Break it on purpose: put a wrong password in `MONGO_URI`, restart, and read the error. Fix it again. (Recognising this error saves you hours later.)

#### E. Docs and commits

22. Create `docs/requirements.md`. Copy the user stories and the non-functional requirements from Section 1, then add *one* back-of-envelope estimate in your own numbers:
    > 500 donors x 3 listings/day = 1,500 writes/day. 2,000 NGOs x 5 checks/day = 10,000 reads/day. That is roughly one request every 9 seconds. **A single small server is plenty.**
23. Commit in small pieces:
    ```bash
    git add server/package.json server/package-lock.json
    git commit -m "chore(server): init project and install dependencies"
    git add server/app.js server/server.js
    git commit -m "feat(server): express app with health route"
    git add server/config
    git commit -m "feat(server): connect to MongoDB Atlas"
    git add docs
    git commit -m "docs: add requirements"
    git switch main && git merge feature/server-setup && git push
    ```

### Key code

**`server/package.json`** (only the parts you change)

```json
{
  "name": "annaseva-server",
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  }
}
```

- `"type": "module"` lets you use `import` instead of `require`.
- `node --watch` restarts the server whenever you save a file. (`nodemon` is the popular alternative.) **It does not reload `.env`, so restart manually after changing it.**
- `start` is what Render will run in production (no auto-restart needed).

**`server/.env`** (never committed)

```bash
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/annaseva_dev?retryWrites=true&w=majority
JWT_SECRET=temporary-change-me-on-day-2
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`server/.env.example`** (committed: same keys, fake values, so future-you knows what to fill in)

```bash
PORT=5000
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/annaseva_dev?retryWrites=true&w=majority
JWT_SECRET=a-long-random-string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`server/config/db.js`**

```js
import mongoose from 'mongoose';

// Connects to MongoDB using the address stored in the MONGO_URI environment variable.
export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If we can't reach the database, the app is useless, so stop with an error code.
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // 1 means "exited because of an error"
  }
}
```

**`server/app.js`**

```js
import express from 'express';
import cors from 'cors';

// Create the Express application: think of it as "the waiter".
const app = express();

// MIDDLEWARE: functions that run on every request, in the order written.
// 1) CORS: only allow our own front end to call this API from a browser.
app.use(cors({ origin: process.env.CLIENT_URL }));
// 2) JSON parser: turns the JSON text in a request into a JavaScript object at req.body.
app.use(express.json());

// ROUTE: when someone sends GET /api/health, run this function.
app.get('/api/health', (req, res) => {
  // status(200) = "OK". json() sends the object back as JSON.
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Export the app so server.js (and later, tests) can use it.
export default app;
```

**`server/server.js`**

```js
// This import MUST be first: it reads .env into process.env
// before any other file tries to use those values.
import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

// Use the PORT from the environment (hosts like Render set it), otherwise 5000.
const PORT = process.env.PORT || 5000;

await connectDB(); // "await" works at the top level in ES modules

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | `GET /api/health` | `200` and `{ "status": "ok", ... }` |
| 2 | `GET /api/does-not-exist` | Express default 404 (we improve this on Day 2) |
| 3 | Terminal shows `MongoDB connected` | host name of your Atlas cluster |
| 4 | Stop the server, change the DB password to a wrong one, start | clear connection failure message |
| 5 | `git status` after creating `.env` and `.env.example` | `.env` does **not** appear; `.env.example` **does** appear as a new file |
| 6 | GitHub repo page | no `.env`, no `node_modules` |

### 🧠 Self-ask questions

Write answers in `docs/journal.md` *without looking at the code*.

1. What is the difference between a client and a server? Use the restaurant analogy.
2. What does `GET` mean, and how is it different from `POST`?
3. What's the difference between status `404`, `401` and `500`?
4. Why is `.env` in `.gitignore`, and why do we commit `.env.example`?
5. What does `app.use(express.json())` do? What would break if you removed it?
6. Why does `import 'dotenv/config'` have to be the first import?
7. What is a database *user* in Atlas, and how is it different from your Atlas account?
8. Why do we use a separate database name for development?
9. What is `node_modules`, and why don't we commit it?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. Client asks, server answers. Browser = customer, Express = waiter.
2. `GET` reads, `POST` creates. `GET` has no body and shouldn't change data.
3. 404 = no such route/resource, 401 = not logged in, 500 = server crashed.
4. Secrets must not be public. The example shows teammates which keys to set, with fake values.
5. It parses JSON request bodies into `req.body`. Without it, `req.body` is `undefined`.
6. Other files read `process.env` as they load. `.env` must be loaded before that.
7. The DB user is the app's credential for the database; your account logs into the Atlas website.
8. So dev experiments and seed scripts can't destroy production data.
9. It holds downloaded packages; it's huge and recreated by `npm install`.

</details>

### 🤖 Use AI like this

- *"Explain what happens, step by step, between typing `http://localhost:5000/api/health` and seeing JSON. Use a restaurant analogy."*
- *"Here's my `app.js`. Explain each line like I'm new to programming. Then quiz me with 3 questions."*
- *"Why does MongoDB Atlas need an IP allow-list? What is the risk of `0.0.0.0/0`, and what protects the database anyway?"*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Missing `"type": "module"` | `Cannot use import statement outside a module` | Add it to `package.json` |
| Leaving out `.js` in a relative import | `ERR_MODULE_NOT_FOUND` | Write `./app.js`, not `./app` |
| Committing `.env` | You see `.env` in `git status` | Add to `.gitignore` *before* committing; rotate secrets if pushed (Section 7.10) |
| Atlas IP not allowed | `MongooseServerSelectionError` / timeout | Add your current IP in Network Access |
| Special characters in password | auth failed | Use a simpler password or URL-encode it |
| Port already in use | `EADDRINUSE` | Another copy is running. `Ctrl + C` it, or change `PORT` |
| Editing `.env` while server runs | Old value still used | Restart the server |
| Putting `<` `>` around the password | auth failed | Remove the angle brackets; they're placeholders |

### Definition of done

- [ ] `GET /api/health` returns JSON locally
- [ ] Terminal shows `MongoDB connected`
- [ ] The GitHub repo contains your commits and **no** secrets
- [ ] `docs/requirements.md` is written
- [ ] You answered the self-ask questions in your journal
- [ ] You can do the explain-back without looking at code

### Git checkpoint

`main` contains: `.gitignore`, `README.md`, `docs/`, and `server/` with a running skeleton. All work merged and pushed.

### Explain-back

> "A server is a program that listens on a port and answers HTTP requests. I built one with Express: a route maps a method and path to a function, and middleware like `express.json()` runs before the route. It connects to MongoDB Atlas using a connection string kept in an environment variable so secrets never reach GitHub."

### Resources

- [MDN: Express/Node introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction)
- [Express: Hello world](https://expressjs.com/en/starter/hello-world.html)
- [MongoDB Atlas: Get Started](https://www.mongodb.com/docs/atlas/getting-started/)
- [Pro Git book, chapters 1 to 3](https://git-scm.com/book/en/v2)

---

## Day 2: Users and Authentication

### Goal

By the end of today:

- A user can **register** (as donor or NGO), **log in** and receive a token.
- `GET /api/auth/me` returns the logged-in user when given a valid token.
- Passwords are stored **hashed**; the API never returns them.
- Middleware can say "must be logged in" and "must be a donor/NGO."
- Input is validated, and errors come back as clean JSON.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1.5 h | Auth concepts (below). Decode a token on jwt.io. |
| Build 1 | 2.5 h | Model, validation, register/login |
| Build 2 | 2 h | Middleware, error handling, routes |
| Test + Git | 45 min | Full test table in Thunder Client |
| Reflect | 1 h | Self-ask and explain-back |

### Concepts to learn first

1. 🟢 **Authentication vs. authorization.**
   - *Authentication* = **who are you?** (ID check at the club door)
   - *Authorization* = **what are you allowed to do?** (the VIP list)
   - In AnnaSeva: login is authentication. "Only donors create listings" is authorization.
2. 🟢 **Hashing vs. encryption.** Encryption is a locked box (you can open it with the key). **Hashing is a blender:** you can turn strawberries into a smoothie but never back. We store the smoothie. At login we blend the typed password the same way and compare. A leaked database then doesn't reveal passwords.
3. 🟢 **bcrypt and salt.** bcrypt adds a random **salt** (so identical passwords get different hashes) and is deliberately **slow** (the "cost" setting, we use 12), making mass-guessing expensive. We use `bcryptjs`, a pure-JavaScript version that installs without build tools.
4. 🟢 **JWT (JSON Web Token): the wristband.** After login the server hands you a token. You show it with every request, like a festival wristband, so you don't re-enter your password. A JWT has three dot-separated parts: `header.payload.signature`.
   - The **payload** (here `{ id, role, exp }`) is only *encoded*, **not secret**. Anyone can read it (try jwt.io).
   - The **signature** is made with your `JWT_SECRET`. Nobody can change the payload without invalidating it, so the server trusts what it signed.
   - It's **stateless**: the server remembers nothing between requests; the token itself is the proof.
5. 🟢 **Middleware chain.** `protect` then `restrictTo('donor')` then `controller`. Each checks one thing and calls `next()` to continue, or responds and stops.
6. 🟢 **Validation ("parse, don't trust").** Every value from a client is hostile until proven valid. **Zod** describes valid input; our `validate` middleware rejects bad input with `400` and passes only **cleaned** data forward as `req.valid`.
7. 🟡 **Mass assignment.** If you wrote `User.create(req.body)`, an attacker could send extra fields (`"role": "admin"`). We pick fields explicitly *and* Zod strips unknown fields.
8. 🔴 **Where to store a token in the browser.** `localStorage` is simple but readable by any injected script (XSS). An `httpOnly` cookie can't be read by scripts but brings CSRF concerns. We use `localStorage` for learning-speed and note the trade-off in `docs/decisions.md`.

### Requirements before you start

- [ ] Day 1 is merged into `main`; `/api/health` works
- [ ] `MONGO_URI` connects
- [ ] You understand `req`, `res`, middleware

### Step-by-step actions

1. `git switch -c feature/auth`
2. Install packages: `cd server && npm install bcryptjs jsonwebtoken zod`
3. Generate a real secret and put it in `server/.env` as `JWT_SECRET`:
   ```bash
   node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
   ```
4. Create **`models/User.js`** (below).
5. Create **`validators/auth.schema.js`** and **`middleware/validate.js`**.
6. Create **`utils/generateToken.js`**.
7. Create **`controllers/auth.controller.js`** with `register`, `login`, `getMe`.
8. Create **`middleware/auth.js`** with `protect` and `restrictTo`.
9. Create **`middleware/error.js`** (clean JSON errors).
10. Create **`routes/auth.routes.js`** and wire everything into **`app.js`**.
11. Run the full test table below in Thunder Client. Save requests in a Thunder Client *collection* named "AnnaSeva" so you can re-run them anytime.
12. Check the database in Atlas: the stored `password` should start with `$2`.
13. Add the decision "Token in localStorage vs httpOnly cookie" to `docs/decisions.md` (3 lines: options, choice, trade-off).
14. Commit in slices, merge, push.

### Key code

**`server/models/User.js`**

```js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// A "schema" describes the SHAPE of a user document and the rules each field must follow.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,    // creates a database index so two users can't share an email
      lowercase: true, // "Asha@X.com" and "asha@x.com" become the same
      trim: true,
    },
    // select: false means queries do NOT return this field unless explicitly requested.
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['donor', 'ngo'], required: true }, // 'admin' is impossible by design
    organization: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true } // Mongoose adds createdAt and updatedAt automatically
);

// A "pre save hook": runs automatically just before a user is saved.
userSchema.pre('save', async function () {
  // Only re-hash if the password changed (not when updating, say, the name).
  if (!this.isModified('password')) return;
  // 12 = the "cost": higher is slower to compute, so harder for attackers to brute-force.
  this.password = await bcrypt.hash(this.password, 12);
});

// A method every user document gets: compares a typed password with the stored hash.
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// When a user is turned into JSON (for responses), strip sensitive/internal fields.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
```

**`server/validators/auth.schema.js`**

```js
import { z } from 'zod';

// Describes what a valid REGISTER request body looks like.
// Anything not listed here (like "isAdmin": true) is silently removed by Zod.
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72), // bcrypt ignores bytes past 72
  role: z.enum(['donor', 'ngo'], { message: "Role must be 'donor' or 'ngo'" }),
  organization: z.string().trim().max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
```

**`server/middleware/validate.js`**

```js
// A factory: validate(schema) returns a middleware that checks one part of the request.
// source is 'body' (default), 'query' (the ?a=b part of the URL) or 'params'.
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]); // safeParse never throws; it returns success/failure

  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Controllers read ONLY req.valid: data that has passed the gate and been cleaned.
  req.valid = result.data;
  next(); // continue to the next middleware or the controller
};
```

**`server/utils/generateToken.js`**

```js
import jwt from 'jsonwebtoken';

// Creates the "wristband". The payload holds only what the server needs to recognise the user.
export function generateToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role }, // payload: readable by anyone, so NO secrets here
    process.env.JWT_SECRET,                       // the signing key: the signature proves it wasn't altered
    { expiresIn: '7d' }                           // after 7 days the token stops working
  );
}
```

**`server/controllers/auth.controller.js`**

```js
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export async function register(req, res) {
  // req.valid has already been validated and cleaned by the validate middleware.
  const { name, email, password, role, organization } = req.valid;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'That email is already registered' }); // 409 = conflict
  }

  // We list fields one by one (never User.create(req.body)): see "mass assignment".
  const user = await User.create({ name, email, password, role, organization });

  // 201 = Created. user is converted to JSON without the password (see toJSON in the model).
  res.status(201).json({ token: generateToken(user), user });
}

export async function login(req, res) {
  const { email, password } = req.valid;

  // password has select:false, so we must ask for it explicitly with +password.
  const user = await User.findOne({ email }).select('+password');

  // SAME message whether the email or the password was wrong,
  // so attackers can't use the message to discover which emails exist.
  const passwordMatches = user && (await user.comparePassword(password));
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: generateToken(user), user });
}

// "Who am I?" The front end calls this on page load to confirm its saved token is still valid.
export async function getMe(req, res) {
  const user = await User.findById(req.user.id);
  res.json({ user });
}
```

> **Express 5 note:** if an `async` handler throws (for example the database is down), Express 5 forwards the error to your error handler automatically. No `try/catch` is needed in every controller. (Older Express 4 tutorials add `try/catch` or wrapper functions everywhere for this reason.)

**`server/middleware/auth.js`**

```js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// protect = "the door check": are you logged in with a valid token?
export async function protect(req, res, next) {
  // The client sends:  Authorization: Bearer <token>
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Please log in' });
  }

  try {
    // jwt.verify checks the signature AND the expiry. It throws if either is wrong.
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm the user still exists (they might have been deleted since the token was issued).
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'This account no longer exists' });

    // Attach the identity to the request so later middleware/controllers can use it.
    req.user = { id: user._id.toString(), role: user.role, name: user.name };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// restrictTo('donor') = "the VIP list": only these roles may continue.
// Must run AFTER protect, because it needs req.user.
export const restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You are not allowed to do this' }); // 403 = known user, no permission
  }
  next();
};
```

**`server/middleware/error.js`**

```js
// Runs when no route matched.
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express recognises an error handler by its FOUR parameters. Keep all four, even if
// `next` is unused. Must be registered LAST in app.js.
export function errorHandler(err, req, res, next) {
  // Errors raised by Express itself (malformed JSON, a body that is too large) carry a
  // status code in the 4xx range. Those are the CLIENT's mistake, not a server bug, so
  // pass them through instead of answering "500".
  const status = err.status ?? err.statusCode;
  if (status >= 400 && status < 500) {
    return res.status(status).json({
      message: status === 413 ? 'Request body too large' : 'Invalid request body',
    });
  }

  console.error(err); // log the real error on the server for YOU to read

  // Translate known database errors into friendly client errors.
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id format' });
  if (err.code === 11000) return res.status(409).json({ message: 'That value already exists' });

  // Anything else is OUR bug. Send a vague message so internals never leak to users.
  res.status(500).json({ message: 'Something went wrong on the server' });
}
```

**`server/routes/auth.routes.js`**

```js
import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';

const router = Router();

// Read each line left to right: path, then the chain of checks, then the controller.
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
```

**`server/app.js`** (updated)

```js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Everything under /api/auth is handled by authRoutes.
app.use('/api/auth', authRoutes);

// ORDER MATTERS: these two must come AFTER all routes.
app.use(notFound);
app.use(errorHandler);

export default app;
```

### Test it

Run every row in Thunder Client. **The rows that should fail are as important as the ones that should succeed.**

| # | Request | Expected |
|---|---|---|
| 1 | `POST /api/auth/register` `{name, email, password(8+), role:"donor"}` | `201`, token, user **without** password |
| 2 | Same email again | `409` |
| 3 | Register with password `"123"` | `400`, message about 8 characters |
| 4 | Register with `role: "admin"` | `400` |
| 5 | Register with `"isAdmin": true` extra field | `201`, and no such field is stored |
| 6 | `POST /api/auth/login` correct | `200`, token |
| 7 | Login with wrong password | `401` "Invalid email or password" |
| 8 | Login with unknown email | `401` (same message as row 7) |
| 9 | `GET /api/auth/me` with no header | `401` |
| 10 | `GET /api/auth/me`, header `Authorization: Bearer <token>` | `200`, user |
| 11 | Same, but change one character in the token | `401` |
| 12 | Paste your token into **jwt.io** | payload shows `id`, `role`, `exp`: readable, not secret |
| 13 | Atlas > Browse Collections > users | `password` begins with `$2` (a hash) |
| 14 | *Temporary* route `router.get('/donor-test', protect, restrictTo('donor'), (req, res) => res.json({ ok: true }))` | donor token `200`; NGO token `403`; no token `401`. **Remove it afterwards.** |

### 🧠 Self-ask questions

1. What is the difference between **authentication** and **authorization**? Give a AnnaSeva example of each.
2. Why do we *hash* passwords instead of encrypting them?
3. What are the three parts of a JWT? Which part is secret?
4. Can a user edit their own token's role to `admin`? Why or why not?
5. What is `JWT_SECRET` for, and what happens if it leaks?
6. What's the difference between `401` and `403`?
7. Why does login return the same error for "wrong email" and "wrong password"?
8. What does `select: false` do on the password field, and where do we override it?
9. Why does `restrictTo` have to come after `protect`?
10. Why validate on the server when the form will also validate?
11. What is *mass assignment*, and how did we prevent it?
12. What's the trade-off of storing the token in `localStorage`?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. Authentication: login proves who you are. Authorization: only donors may create listings.
2. Hashes can't be reversed. If the database leaks, passwords stay safe.
3. Header, payload, signature. The secret is the *signing key* on the server; the payload is public.
4. No. Changing the payload breaks the signature, so `verify` fails.
5. It signs tokens. If leaked, anyone can forge tokens. Rotate it.
6. 401 = not authenticated. 403 = authenticated but not allowed.
7. So attackers can't test which emails are registered.
8. The hash is excluded from queries by default. Login uses `.select('+password')`.
9. `restrictTo` reads `req.user`, which `protect` sets.
10. Clients can be bypassed. The server is the only trustworthy gate.
11. Sending extra fields to set things like `role`. We list fields explicitly and Zod strips unknown keys.
12. Easy to use, but any injected script can read it (XSS). Cookies avoid that but add CSRF concerns.

</details>

### 🤖 Use AI like this

- *"Explain JWT authentication using a festival-wristband analogy. Then show the smallest working example of sign and verify, with comments."*
- *"Review my `protect` middleware for security problems. List issues by importance. Don't rewrite it."*
- *"Quiz me: give me 5 scenarios and I'll say whether each is a 401, 403 or 409."*
- *"What would change if I used httpOnly cookies instead of the Authorization header? Compare in a table."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Forgot `await` on `User.findOne(...)` | `user` is a Promise; everything weird | Add `await` |
| `JWT_SECRET` missing | `secretOrPrivateKey must have a value` | Set it in `.env`, restart |
| No `express.json()` | `req.body` undefined, Zod complains "expected object, received undefined" | Add the middleware *before* routes |
| Sending the token without `Bearer ` | always `401` | Header: `Authorization: Bearer <token>` |
| Returning the password hash | hash visible in responses | `select:false` and the `toJSON` transform |
| `notFound`/`errorHandler` placed above routes | every route returns 404 | Move them to the **end** of `app.js` |
| Error handler with 3 parameters | Express ignores it | It must have exactly **four** (`err, req, res, next`) |
| Importing without `.js` | `ERR_MODULE_NOT_FOUND` | `import x from './x.js'` |
| Storing plain passwords "just for now" | n/a | Never. Hash from the first line |

### Definition of done

- [ ] All 14 test rows behave as expected
- [ ] Passwords in Atlas are hashes
- [ ] The temporary `donor-test` route is removed
- [ ] Thunder Client collection saved
- [ ] `docs/decisions.md` has the token-storage decision
- [ ] Self-ask answered; explain-back said aloud

### Git checkpoint

```bash
git add server/models server/validators
git commit -m "feat(auth): add User model with hashed passwords and Zod schemas"
git add server/middleware/validate.js server/middleware/error.js
git commit -m "feat: add validation and error-handling middleware"
git add server/controllers server/routes server/utils server/app.js
git commit -m "feat(auth): register, login and me endpoints"
git add server/middleware/auth.js
git commit -m "feat(auth): protect and restrictTo middleware"
git add docs && git commit -m "docs: record token storage decision"
git switch main && git merge feature/auth && git push
```

### Explain-back

> "Registration validates the input, hashes the password with bcrypt, and stores the user. Login compares the typed password to the hash and returns a signed JWT. On later requests, `protect` verifies the token's signature and expiry, and `restrictTo` checks the role. So the server can trust the identity without storing sessions."

### Resources

- [jwt.io: Introduction](https://jwt.io/introduction)
- [Mongoose: Schemas](https://mongoosejs.com/docs/guide.html) and [Middleware (hooks)](https://mongoosejs.com/docs/middleware.html)
- [Zod documentation](https://zod.dev)
- [Express: Error handling](https://expressjs.com/en/guide/error-handling.html)
- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## Day 3: The Listings API

### Goal

By the end of today:

- A **donor** can create a listing through the API.
- A donor can see their own listings.
- An **NGO** can search "available food within X km of me", nearest first.
- Expired food never appears. Input is validated. Roles are enforced.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1.5 h | Data modelling, GeoJSON, indexes |
| Build 1 | 2.5 h | Model, validators |
| Build 2 | 2 h | Controller, routes, wiring |
| Test + Git | 45 min | Test table |
| Reflect | 1 h | Self-ask, explain-back, journal |

### Concepts to learn first

1. 🟢 **Data modelling: what is stored where.** A listing needs to know who posted it. We store the donor's **`_id`** (a *reference*) instead of copying the donor's name into the listing. **Trade-off:** if the donor renames their organisation, every listing is automatically up to date, but reading needs an extra lookup (`populate`). Copying (*embedding*) is faster to read but can go stale.
2. 🟢 **GeoJSON.** The standard way to store a location: `{ type: 'Point', coordinates: [longitude, latitude] }`.
   > **Longitude first, then latitude.** This is the **opposite** of Google Maps' "lat, lng". Mixing them up puts pins in the wrong country. It's the #1 geo bug.
3. 🟢 **Index.** **Analogy:** the index at the back of a book. Without it, finding "Mumbai" means reading every page (a *collection scan*). With it, you jump straight to the right pages. The cost: extra storage and slightly slower writes. A **`2dsphere` index** is the special index that makes "find places near me" possible. Without it, `$near` queries fail.
4. 🟢 **Query operators.** `$gt` means greater-than. `{ expiresAt: { $gt: new Date() } }` means "expires in the future." `$near` + `$maxDistance` (in **metres**) means "within this distance, nearest first."
5. 🟢 **Authorization on the *resource*.** Role checks aren't enough: "donors can create listings" doesn't mean "donor A can edit donor B's listing." We always include the owner in the database filter (`{ _id, donor: req.user.id }`). Forgetting this is a classic flaw called **IDOR** (Insecure Direct Object Reference).
6. 🟢 **Let the database filter.** Ask MongoDB for exactly what you need (`status`, `expiresAt`, `$near`, `.limit()`), rather than fetching everything and filtering in JavaScript.
7. 🟡 **Derived data.** "Expired" is *calculated* from `expiresAt`, never stored, so it can't go out of date and we need no background job.
8. 🟡 **Trust the server's clock.** Always compare against `new Date()` on the server, never a time sent by the browser.
9. 🔴 **Distance in results.** `$near` sorts by distance but doesn't tell you the number. `aggregate([{ $geoNear: ... }])` returns a `distanceField`. (Stretch goal; on Day 7 we compute distance on the client instead.)

### Requirements before you start

- [ ] Day 2 merged; register, login and `/me` all pass the test table
- [ ] You have a donor token and an NGO token saved in Thunder Client environment variables

### Step-by-step actions

1. `git switch -c feature/listings`
2. Create **`models/Listing.js`** with the schema and **three indexes**.
3. Create **`validators/listing.schema.js`**: one schema for creating, one for the nearby query.
4. Create **`controllers/listing.controller.js`** with `createListing`, `getMyListings`, `getNearby`, `getMyClaims`.
5. Create **`routes/listing.routes.js`**. `router.use(protect)` makes the whole file login-only.
6. Mount the routes in `app.js`: add `import listingRoutes from './routes/listing.routes.js';` next to your other imports, then add `app.use('/api/listings', listingRoutes);` directly below the auth routes and **above** `notFound` (Express checks routes in the order written, so anything after `notFound` is never reached).
7. Restart; confirm in Atlas **Indexes** tab that `location_2dsphere` exists.
8. Work through the test table.
9. Look at a stored listing in Atlas and **find the coordinates**. Which number is longitude?
10. Add to `docs/decisions.md`: "Reference donor by id instead of embedding" and "Expiry computed, not stored."
11. Commit, merge, push.

### Key code

**`server/models/Listing.js`**

```js
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    foodType: { type: String, enum: ['veg', 'non-veg', 'vegan', 'mixed'], required: true },
    quantity: { type: Number, required: true, min: 1, max: 10000 }, // number of meals / portions

    preparedAt: { type: Date, required: true }, // food-safety context: when was it made?
    expiresAt: { type: Date, required: true },  // after this time the listing is not offered
    pickupAddress: { type: String, required: true, trim: true, maxlength: 200 },

    // GeoJSON Point: [LONGITUDE, latitude]  <-- longitude FIRST
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (c) =>
            Array.isArray(c) && c.length === 2 &&
            c[0] >= -180 && c[0] <= 180 &&   // longitude range
            c[1] >= -90 && c[1] <= 90,       // latitude range
          message: 'coordinates must be [longitude, latitude] within valid ranges',
        },
      },
    },

    // A reference to a document in the users collection. populate() can swap it for the real user.
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: ['available', 'claimed', 'completed', 'cancelled'], // "expired" is computed, not stored
      default: 'available',
    },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    claimedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

// INDEXES: shortcuts the database keeps up to date. Each speeds up reads and slightly slows writes.
listingSchema.index({ location: '2dsphere' });            // required for $near ("find nearby")
listingSchema.index({ donor: 1, createdAt: -1 });         // "my listings, newest first"
listingSchema.index({ claimedBy: 1, claimedAt: -1 });     // "my claims, newest first"

export default mongoose.model('Listing', listingSchema);
```

**`server/validators/listing.schema.js`**

```js
import { z } from 'zod';

const MAX_HOURS_AHEAD = 24; // food-safety rule: nothing should be offered for more than a day

// z.coerce.number() converts "12" (text from the URL or a form) into the number 12.
// TRAP: it also turns an EMPTY string "" into 0, and z.coerce.date() turns null into
// 1 January 1970. So a blank form field would quietly pass validation and a listing
// could be saved at latitude 0, longitude 0 (the ocean off Africa).
// This helper turns blank values into "missing" FIRST, so Zod rejects them properly.
const blankIsMissing = (value) => (value === '' || value === null ? undefined : value);

export const createListingSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().trim().max(500).optional(),
    foodType: z.enum(['veg', 'non-veg', 'vegan', 'mixed']),
    quantity: z.coerce.number().int().min(1).max(10000),
    preparedAt: z.preprocess(blankIsMissing, z.coerce.date()),
    expiresAt: z.preprocess(blankIsMissing, z.coerce.date()),
    pickupAddress: z.string().trim().min(5, 'Please give a fuller address').max(200),
    // The API accepts friendly lat/lng. The SERVER builds the GeoJSON in the right order.
    latitude: z.preprocess(blankIsMissing, z.coerce.number().min(-90).max(90)),
    longitude: z.preprocess(blankIsMissing, z.coerce.number().min(-180).max(180)),
  })
  .refine((d) => d.expiresAt > new Date(), {
    message: 'Expiry time must be in the future',
    path: ['expiresAt'],
  })
  .refine((d) => d.expiresAt > d.preparedAt, {
    message: 'Expiry must be after the preparation time',
    path: ['expiresAt'],
  })
  .refine((d) => d.expiresAt.getTime() - Date.now() <= MAX_HOURS_AHEAD * 3600 * 1000, {
    message: `Food can be listed for at most ${MAX_HOURS_AHEAD} hours`,
    path: ['expiresAt'],
  });

// For GET /api/listings/nearby?lat=18.52&lng=73.85&radiusKm=5
export const nearbySchema = z.object({
  lat: z.preprocess(blankIsMissing, z.coerce.number().min(-90).max(90)),
  lng: z.preprocess(blankIsMissing, z.coerce.number().min(-180).max(180)),
  radiusKm: z.coerce.number().min(0.5).max(50).default(10),
});
```

**`server/controllers/listing.controller.js`** (Day 3 portion)

```js
import Listing from '../models/Listing.js';

// DONOR: create a listing
export async function createListing(req, res) {
  const { latitude, longitude, ...fields } = req.valid; // "...fields" = everything else

  const listing = await Listing.create({
    ...fields,                    // safe: Zod already removed any unexpected fields (like "status")
    donor: req.user.id,           // from the verified token, NEVER from the request body
    location: { type: 'Point', coordinates: [longitude, latitude] }, // GeoJSON order!
  });

  res.status(201).json({ listing });
}

// DONOR: my listings, newest first
export async function getMyListings(req, res) {
  const listings = await Listing.find({ donor: req.user.id })
    .sort({ createdAt: -1 })
    .populate('claimedBy', 'name organization'); // swap the id for a small user object
  res.json({ count: listings.length, listings });
}

// NGO: available food near me, nearest first
export async function getNearby(req, res) {
  const { lat, lng, radiusKm } = req.valid;

  const listings = await Listing.find({
    status: 'available',
    expiresAt: { $gt: new Date() }, // hides expired food, no cron job required
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] }, // longitude first!
        $maxDistance: radiusKm * 1000,                          // metres
      },
    },
  })
    .limit(50)                            // never return unlimited rows
    .populate('donor', 'name organization')
    .lean();                              // plain JS objects: faster, since we won't modify them

  res.json({ count: listings.length, listings });
}

// NGO: listings I have claimed
export async function getMyClaims(req, res) {
  const listings = await Listing.find({ claimedBy: req.user.id })
    .sort({ claimedAt: -1 })
    .populate('donor', 'name organization');
  res.json({ count: listings.length, listings });
}
```

**`server/routes/listing.routes.js`**

```js
import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createListingSchema, nearbySchema } from '../validators/listing.schema.js';
import {
  createListing, getMyListings, getNearby, getMyClaims,
} from '../controllers/listing.controller.js';

const router = Router();

router.use(protect); // EVERY route in this file requires a valid login

router.post('/', restrictTo('donor'), validate(createListingSchema), createListing);
router.get('/mine', restrictTo('donor'), getMyListings);
router.get('/nearby', restrictTo('ngo'), validate(nearbySchema, 'query'), getNearby);
router.get('/claimed', restrictTo('ngo'), getMyClaims);

export default router;
```

### Test it

Sample create body (change the numbers to your city; `expiresAt` must be within 24 h from now):

```json
{
  "title": "Vegetable biryani",
  "description": "Serves about 20. Bring containers.",
  "foodType": "veg",
  "quantity": 20,
  "preparedAt": "2026-10-25T12:00:00.000Z",
  "expiresAt": "2026-10-25T18:00:00.000Z",
  "pickupAddress": "12 MG Road, near the bus stop",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

| # | Check | Expected |
|---|---|---|
| 1 | `POST /api/listings` with donor token | `201`, listing with `status: "available"` |
| 2 | Same with NGO token | `403` |
| 3 | Same with no token | `401` |
| 4 | Missing `title` | `400`, `errors` array names the field |
| 5 | `expiresAt` in the past | `400` |
| 6 | `expiresAt` 3 days ahead | `400` (24-hour rule) |
| 7 | `latitude: 200` | `400` |
| 8 | Body includes `"status": "completed"` | `201` but stored `status` is `available` (field stripped) |
| 9 | Atlas: open the listing | `coordinates` is `[longitude, latitude]` |
| 10 | `GET /api/listings/nearby?lat=..&lng=..&radiusKm=5` with NGO token | listing appears |
| 11 | Same query with coordinates ~100 km away | empty list |
| 12 | Create 3 listings at slightly different spots, search again | sorted **nearest first** |
| 13 | `/nearby` with donor token / `/mine` with NGO token | `403` both |
| 14 | A second donor calls `/mine` | doesn't see the first donor's listings |
| 15 | Atlas > Indexes tab | `location_2dsphere` is listed |

### 🧠 Self-ask questions

1. Why does a listing store the donor's `_id` instead of the donor's name?
2. In GeoJSON, which comes first: latitude or longitude? What goes wrong if you swap them?
3. What is an index? What does it cost?
4. Why does `$near` require a `2dsphere` index?
5. Why do we filter expired listings in the query instead of deleting them or using a cron job?
6. Why must `donor` come from `req.user.id` and not from the request body?
7. What is IDOR? Which line of code prevents it on Day 4's complete/cancel?
8. What does `.lean()` do, and when is it safe?
9. Why `.limit(50)`?
10. What does `populate` do, and what does it cost?
11. Why is `radiusKm * 1000` in the query?
12. The create body included `"status": "completed"`. Why was that ignored?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. One source of truth; names changing doesn't break listings. Trade-off: extra lookup.
2. Longitude first. Swapped, pins land in the wrong place (possibly another country).
3. A shortcut structure for fast lookups. Costs storage and slower writes.
4. It's how MongoDB computes spherical distance quickly. Without it the query errors.
5. History stays for stats; expiry can't go stale; no background job.
6. A client could otherwise post on behalf of someone else. The token is the trusted identity.
7. Insecure Direct Object Reference: acting on other people's objects by guessing an id. The `donor: req.user.id` in the filter.
8. Returns plain objects instead of full Mongoose documents. Safe for read-only responses.
9. A result set must never be unbounded. It protects the server and the browser.
10. Replaces an id with the referenced document; costs an extra query.
11. `$maxDistance` is in metres.
12. Zod strips unknown keys, and `status` isn't in the schema, so it defaults to `available`.

</details>

### 🤖 Use AI like this

- *"Explain the difference between embedding and referencing in MongoDB with a library analogy. When would I embed the donor info instead?"*
- *"Explain what a `2dsphere` index is and what `$near` does internally, at beginner level. Why is distance in metres?"*
- *"Here's my listing schema. What's missing for food safety and abuse prevention? Rank by importance, don't write code yet."*
- *"What could go wrong if two donors post the same food twice? Is that my problem to solve?"*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| `[lat, lng]` instead of `[lng, lat]` | Pins in the ocean / wrong country; search returns nothing | Longitude first. Put a comment next to every GeoJSON array |
| Missing `2dsphere` index | `unable to find index for $geoNear query` | Add `listingSchema.index({ location: '2dsphere' })`; restart |
| Query params used as strings | `$maxDistance` errors or wrong results | `z.coerce.number()` in the schema |
| Dates sent in a weird format | `Invalid Date` / validation errors | Send ISO strings (`2026-10-25T18:00:00.000Z`) |
| Trusting `donor` from the body | Anyone can post as anyone | Always use `req.user.id` |
| `status` accepted from the client | Donors could create "completed" listings | Zod strips unknown keys; never read it from the body |
| Route order after `notFound` | listings routes return 404 | Mount routes **above** `notFound` |
| Returning every document | slow page and huge payloads | `.limit()` |

### Definition of done

- [ ] All 15 test rows pass
- [ ] The `2dsphere` index is visible in Atlas
- [ ] You can explain longitude-first without notes
- [ ] Decisions logged; self-ask answered

### Git checkpoint

```bash
git add server/models/Listing.js
git commit -m "feat(listings): add Listing model with geospatial index"
git add server/validators/listing.schema.js
git commit -m "feat(listings): validate create and nearby requests"
git add server/controllers server/routes server/app.js
git commit -m "feat(listings): create, mine, nearby and claimed endpoints"
git add docs && git commit -m "docs: add listing design decisions"
git switch main && git merge feature/listings && git push
```

### Explain-back

> "A listing stores its location as GeoJSON, longitude first, and a 2dsphere index lets MongoDB answer 'what's within 5 km?' quickly. Donors create listings; the donor id comes from the verified token, not the request. The nearby query filters by status and expiry in the database, so expired food simply never shows up."

### Resources

- [MongoDB: Geospatial queries](https://www.mongodb.com/docs/manual/geospatial-queries/)
- [MongoDB: `$near`](https://www.mongodb.com/docs/manual/reference/operator/query/near/)
- [MongoDB: Indexes](https://www.mongodb.com/docs/manual/indexes/)
- [Mongoose: Populate](https://mongoosejs.com/docs/populate.html)
- [OWASP: IDOR prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)

---

## Day 4: The Claim System and the System-Design Lab

### Goal

By the end of today:

- An NGO can **claim** a listing, and **exactly one** claim can ever succeed, even when 20 arrive at once.
- A donor can **complete** (picked up) or **cancel** their own listing.
- You have a **seed script** with realistic demo data.
- You have *seen* a race condition with your own eyes, and seen an index change a query plan.

> This is the most important day for interviews. The atomic claim is your best "system design" talking point.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1 h | Race conditions, atomic operations |
| Build 1 | 1.5 h | `validateId`, seed script |
| Lab 1 | 1.5 h | Broken claim, race test, fixed claim |
| Build 2 | 1 h | Complete + cancel |
| Lab 2 | 1 h | Index experiment with `explain()` |
| Reflect | 1 h | Self-ask, decisions log, journal |

### Concepts to learn first

1. 🟢 **Race condition.** **Analogy:** two people see one slice of cake left. Both think "I'll take it," both walk over. One finds an empty plate. In code: *check* "is it available?" then *update* "mark claimed." In the tiny gap between those two steps, a second request can sneak in, so both think they won.
2. 🟢 **Atomic operation.** Do the check and the change as **one indivisible step**. **Analogy:** a cashier who scans and bags in one motion; nobody can slip an item in between. MongoDB's `findOneAndUpdate` means: "find the document that matches *all* these conditions **and** change it, in one go." If two requests race, the database handles them one at a time and only one still matches.
3. 🟢 **The filter *is* the guard.** Our filter `{ status: 'available', expiresAt > now }` is the rule "you may only claim available, unexpired listings." The same trick enforces every legal state change (see the state diagram in Section 4).
4. 🟢 **404 vs 409 vs 403.**
   - `404` Not Found: no such listing (or it isn't yours to know about).
   - `409` Conflict: the listing exists but its state doesn't allow this action.
   - `403` Forbidden: your *role* can't do this at all.
5. 🟡 **Don't leak existence.** If donor B tries to complete donor A's listing, we return `404`, not `409`, so B learns nothing about A's data.
6. 🟡 **Testing concurrency.** A single manual click can't reproduce a race. A script that fires 20 requests *at the same instant* (`Promise.all`) can.
7. 🟡 **Query plans.** `explain('executionStats')` shows *how* MongoDB found the answer. `COLLSCAN` = read the whole collection. `IXSCAN` = used an index. `totalDocsExamined` is the evidence.
8. 🟢 **Seeding.** A script that fills the database with realistic data so every screen you build has something to show.

### Requirements before you start

- [ ] Day 3 merged; create + nearby work
- [ ] You can log in as a donor and an NGO in Thunder Client
- [ ] Your dev database name ends with `_dev`

### Step-by-step actions

1. `git switch -c feature/claim`
2. Create **`middleware/validateId.js`** (below).
3. Create **`scripts/seed.js`** (below), then run `node scripts/seed.js 15`. Note the demo accounts it prints.
4. Log in as `ngo.demo@example.com` in Thunder Client and call `/nearby` around your seed centre. Copy one listing's `_id`.
5. **Lab 1a: write the BROKEN claim first** (below). *Do not commit it.* Temporarily point the claim route at it: in `routes/listing.routes.js` import `claimListingBroken` and use it as the last argument of `router.patch('/:id/claim', ...)` instead of `claimListing`.
6. Create **`scripts/race-test.js`**. Run it against the broken version:
   `node scripts/race-test.js <listingId> <ngoToken>`
   Write down the output in your journal. **You should see several `200`s: that's the bug.** (Exact numbers vary.)
7. Reset the listing to `available` in Atlas (edit `status`, set `claimedBy` to `null`), or re-seed.
8. **Lab 1b: replace the broken code with the atomic version.** Run the race test again on a fresh available listing. **Expected: one `200`, nineteen `409`.**
9. Write the `complete` and `cancel` handlers and routes. Test them.
10. **Lab 2:** create **`scripts/explain-lab.js`** and run it. Record the numbers.
11. Write the decision "Atomic claim instead of check-then-update" in `docs/decisions.md`, plus the lab numbers.
12. Commit (**the broken version must not be in your commits**), merge, push.

### Key code

**`server/middleware/validateId.js`**

```js
import mongoose from 'mongoose';

// Stops garbage like /api/listings/abc/claim before it reaches the database.
export function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid listing id' });
  }
  next();
}
```

**Lab 1a: the BROKEN claim (do not keep this)**

```js
// BROKEN ON PURPOSE: check first, update second. Do NOT commit this.
export async function claimListingBroken(req, res) {
  const listing = await Listing.findById(req.params.id);

  if (!listing || listing.status !== 'available') {
    return res.status(409).json({ message: 'Not available' });
  }

  // This delay makes the race easy to see. Real servers have a smaller gap, but it exists.
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Between the check above and this save, another request can ALSO pass the check.
  listing.status = 'claimed';
  listing.claimedBy = req.user.id;
  listing.claimedAt = new Date();
  await listing.save();

  res.json({ listing });
}
```

**Lab 1b: the CORRECT, atomic version** (append to `listing.controller.js`)

```js
// If a transition fails, work out WHY: does the listing exist at all?
// existsFilter limits what the caller is allowed to know about.
async function failTransition(res, existsFilter, conflictMessage) {
  const exists = await Listing.exists(existsFilter);
  if (!exists) return res.status(404).json({ message: 'Listing not found' });
  return res.status(409).json({ message: conflictMessage });
}

// NGO: claim a listing. ATOMIC: the check and the change happen in ONE database operation.
export async function claimListing(req, res) {
  const { id } = req.params;

  const listing = await Listing.findOneAndUpdate(
    // CONDITION (the guard): only match if it is STILL available and NOT expired
    { _id: id, status: 'available', expiresAt: { $gt: new Date() } },
    // CHANGE: applied only if the condition matched
    { status: 'claimed', claimedBy: req.user.id, claimedAt: new Date() },
    // returnDocument: 'after' returns the document AFTER the update (the default is the version before).
    // Older tutorials write { new: true } instead. It still works but is deprecated in current Mongoose.
    { returnDocument: 'after' }
  ).populate('donor', 'name organization');

  // null means nothing matched: someone was faster, or it expired, or it doesn't exist.
  if (!listing) {
    return failTransition(res, { _id: id }, 'This listing was already claimed or has expired');
  }

  res.json({ listing });
}

// DONOR: mark a claimed listing as picked up. Only the owner, only from "claimed".
export async function completeListing(req, res) {
  const { id } = req.params;

  const listing = await Listing.findOneAndUpdate(
    { _id: id, donor: req.user.id, status: 'claimed' },   // donor: req.user.id = ownership check
    { status: 'completed', completedAt: new Date() },
    { returnDocument: 'after' }
  ).populate('claimedBy', 'name organization');

  if (!listing) {
    // Look only among THIS donor's listings, so other people's listings stay invisible (404).
    return failTransition(res, { _id: id, donor: req.user.id }, 'Only a claimed listing can be marked as picked up');
  }
  res.json({ listing });
}

// DONOR: cancel a listing that is still available or claimed.
export async function cancelListing(req, res) {
  const { id } = req.params;

  const listing = await Listing.findOneAndUpdate(
    { _id: id, donor: req.user.id, status: { $in: ['available', 'claimed'] } },
    { status: 'cancelled' },
    { returnDocument: 'after' }
  ).populate('claimedBy', 'name organization');

  if (!listing) {
    return failTransition(res, { _id: id, donor: req.user.id }, 'This listing can no longer be cancelled');
  }
  res.json({ listing });
}
```

> **Best practice to remember:** `findOneAndUpdate` skips schema validators by default. Our update values are fixed by *us*, so that's safe here. If you ever update with user-provided values, add `{ runValidators: true }`.

**Add to `routes/listing.routes.js`** (after the Day 3 routes; import `validateId` and the three new controllers)

```js
router.patch('/:id/claim', restrictTo('ngo'), validateId, claimListing);
router.patch('/:id/complete', restrictTo('donor'), validateId, completeListing);
router.patch('/:id/cancel', restrictTo('donor'), validateId, cancelListing);
```

**`server/scripts/race-test.js`**

```js
// Fires 20 claim requests at the SAME moment and prints how many won.
// Usage: node scripts/race-test.js <listingId> <ngoToken>
const [listingId, token] = process.argv.slice(2);
const BASE = process.env.API_URL || 'http://localhost:5000/api';

if (!listingId || !token) {
  console.error('Usage: node scripts/race-test.js <listingId> <ngoToken>');
  process.exit(1);
}

// Build 20 requests WITHOUT waiting for each: they all start together.
const requests = Array.from({ length: 20 }, () =>
  fetch(`${BASE}/listings/${listingId}/claim`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })
);

// Promise.all waits until all 20 have finished.
const responses = await Promise.all(requests);
const statuses = responses.map((r) => r.status);

// Count how many of each status code appeared, e.g. { '200': 1, '409': 19 }
const summary = statuses.reduce((counts, s) => ({ ...counts, [s]: (counts[s] || 0) + 1 }), {});

console.log('Statuses:', statuses.join(' '));
console.log('Summary: ', summary);
console.log(summary[200] === 1 ? 'PASS: exactly one winner' : 'FAIL: expected exactly one 200');
```

**`server/scripts/seed.js`**

```js
// Fills your DEV database with demo users and listings.
// Usage: node scripts/seed.js [count] [--force]
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

const CENTER = { lat: 18.5204, lng: 73.8567 }; // example city centre. CHANGE THIS to your own city
const MAX_KM = 8;                              // spread listings inside a circle of about 8 km around the centre
const COUNT = Number(process.argv.find((a) => /^\d+$/.test(a))) || 15;
const FORCE = process.argv.includes('--force');
// For a PUBLIC (production) database, pass a strong password instead (Day 10): DEMO_PASSWORD="..." node scripts/seed.js 12 --force
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Demo@12345';

const DEMO_USERS = [
  { name: 'Demo Donor', email: 'donor.demo@example.com', role: 'donor', organization: 'Spice Garden Restaurant' },
  { name: 'Demo NGO', email: 'ngo.demo@example.com', role: 'ngo', organization: 'Helping Hands Trust' },
];

const FOOD = [
  { title: 'Vegetable biryani', foodType: 'veg' },
  { title: 'Dal and rice', foodType: 'veg' },
  { title: 'Chapati and sabzi', foodType: 'veg' },
  { title: 'Chicken curry and rice', foodType: 'non-veg' },
  { title: 'Sandwich platter', foodType: 'veg' },
  { title: 'Fresh fruit salad', foodType: 'vegan' },
  { title: 'Mixed buffet leftovers', foodType: 'mixed' },
];

const pick = (array) => array[Math.floor(Math.random() * array.length)];

// Random GeoJSON point inside a CIRCLE of maxKm around a centre.
// Math.sqrt spreads the points evenly over the circle's area (without it they bunch up near the centre).
// 1 degree of latitude is about 111 km; a degree of longitude is shorter the further you are from the equator.
function randomPointNear(center, maxKm) {
  const distanceKm = maxKm * Math.sqrt(Math.random());
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (distanceKm * Math.sin(angle)) / 111;
  const dLng = (distanceKm * Math.cos(angle)) / (111 * Math.cos((center.lat * Math.PI) / 180));
  return [center.lng + dLng, center.lat + dLat]; // [LONGITUDE, latitude]
}

await mongoose.connect(process.env.MONGO_URI);
const dbName = mongoose.connection.name;
console.log(`Connected to database: ${dbName}`);

// Safety net: refuse to touch a database that doesn't look like a dev one.
if (!dbName.endsWith('_dev') && !FORCE) {
  console.error('Refusing to seed a non-dev database. Re-run with --force if you really mean it.');
  process.exit(1);
}

// Find or create the demo users. User.create runs the password-hashing hook.
const users = {};
for (const u of DEMO_USERS) {
  users[u.role] = (await User.findOne({ email: u.email })) || (await User.create({ ...u, password: DEMO_PASSWORD }));
}

// Remove this demo donor's old listings so the script can be re-run safely.
await Listing.deleteMany({ donor: users.donor._id });

const now = Date.now();
const listings = Array.from({ length: COUNT }, () => ({
  ...pick(FOOD),
  description: 'Freshly prepared today. Please bring your own containers.',
  quantity: 5 + Math.floor(Math.random() * 60),
  preparedAt: new Date(now - 30 * 60 * 1000),                         // made 30 minutes ago
  expiresAt: new Date(now + (1 + Math.random() * 5) * 3600 * 1000),   // expires in 1 to 6 hours
  pickupAddress: 'Demo address: replace with a real one',
  location: { type: 'Point', coordinates: randomPointNear(CENTER, MAX_KM) },
  donor: users.donor._id,
}));

await Listing.insertMany(listings); // one batch insert is far faster than COUNT separate inserts
console.log(`Inserted ${COUNT} listings.`);
console.log(`Demo logins -> donor.demo@example.com / ngo.demo@example.com  (password: ${DEMO_PASSWORD})`);

await mongoose.disconnect();
```

> Demo accounts are fine for a *demo*. Never keep a known password on a real production system with real users. Day 10 explains how to seed production safely for your demo and remove it afterwards.

**`server/scripts/explain-lab.js`** (Lab 2: see an index at work)

```js
// Shows how an index changes the way MongoDB answers a query.
// Run `node scripts/seed.js 15` first. Usage: node scripts/explain-lab.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

await mongoose.connect(process.env.MONGO_URI);
if (!mongoose.connection.name.endsWith('_dev')) {
  console.error('This lab only runs on a *_dev database.');
  process.exit(1);
}

const donor = await User.findOne({ email: 'donor.demo@example.com' });

// 1) Add 20,000 "noise" listings from random other donors, so the index has something to skip.
const NOISE = 20000;
const template = {
  title: '__noise__', foodType: 'veg', quantity: 1, pickupAddress: 'noise address',
  preparedAt: new Date(), expiresAt: new Date(Date.now() + 3600 * 1000),
  location: { type: 'Point', coordinates: [73.85, 18.52] },
};
await Listing.insertMany(
  Array.from({ length: NOISE }, () => ({ ...template, donor: new mongoose.Types.ObjectId() }))
);
console.log(`Inserted ${NOISE} noise listings.`);

// 2) Ask MongoDB to EXPLAIN how it answers "all listings of this donor".
async function report(label) {
  const raw = await Listing.find({ donor: donor._id }).explain('executionStats');
  const result = Array.isArray(raw) ? raw[0] : raw; // some versions wrap it in an array
  const stats = result.executionStats;
  const usedIndex = JSON.stringify(result.queryPlanner.winningPlan).includes('IXSCAN');

  console.log(`\n${label}`);
  console.log(`  plan:               ${usedIndex ? 'IXSCAN (used the index)' : 'COLLSCAN (read everything)'}`);
  console.log(`  documents examined: ${stats.totalDocsExamined}`);
  console.log(`  documents returned: ${stats.nReturned}`);
  console.log(`  time (ms):          ${stats.executionTimeMillis}`);
}

await report('WITH the donor index');

await Listing.collection.dropIndex('donor_1_createdAt_-1'); // remove the index temporarily
await report('WITHOUT the donor index');

await Listing.syncIndexes();                      // put the index back
await Listing.deleteMany({ title: '__noise__' }); // clean up the noise
console.log('\nCleaned up and restored the index.');

await mongoose.disconnect();
```

> **Free-tier note:** Atlas's free cluster is limited to about 100 operations per second and 0.5 GB of storage (see Section 2). If inserting the 20,000 noise listings feels slow, be patient, or lower `NOISE` to `5000`: the difference between the two plans is still obvious. Never point this lab at a production database; the script already refuses any database whose name doesn't end in `_dev`.

**Expected shape of the result** (your numbers will differ): *with* the index, about 15 documents examined; *without* it, about 20,000. The time difference on a collection this small is only a few milliseconds. **That is the lesson as well:** at small scale, an index barely matters. Don't optimise what you haven't measured.

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | `node scripts/seed.js 15` | "Inserted 15 listings" |
| 2 | NGO `/nearby` at your seed centre | ~15 results, nearest first |
| 3 | **Broken** claim + race test | **More than one `200`** (record it) |
| 4 | **Atomic** claim + race test, fresh listing | **Exactly one `200`, nineteen `409`**, `PASS` message |
| 5 | Claim an already-claimed listing | `409` |
| 6 | Claim a valid-looking but non-existent id | `404` |
| 7 | Claim with id `abc` | `400` |
| 8 | Claim with a donor token | `403` |
| 9 | Set a listing's `expiresAt` to the past in Atlas, then claim | `409` |
| 10 | Owner donor completes a claimed listing | `200`, `status: "completed"` |
| 11 | Complete an unclaimed listing | `409` |
| 12 | A *different* donor completes someone else's listing | `404` |
| 13 | Owner cancels an available listing | `200`, `cancelled` |
| 14 | Cancel a completed listing | `409` |
| 15 | `explain-lab.js` output saved in your journal | with vs. without numbers recorded |

### 🧠 Self-ask questions

1. In your own words, what is a race condition? Use the cake analogy.
2. Why does check-then-update fail when two requests arrive together?
3. What makes `findOneAndUpdate` safe here? What does "atomic" mean?
4. Why does `Promise.all` matter in the race test? What would happen with a `for` loop and `await` inside it?
5. What's the difference between `404`, `409` and `403`? Give a AnnaSeva example of each.
6. Why does completing someone else's listing return `404` and not `403` or `409`?
7. What does `{ returnDocument: 'after' }` do? What happens without it?
8. Draw the status state machine from memory. Which transitions are legal, and which line of code enforces each?
9. What is `COLLSCAN` vs `IXSCAN`? What did your lab numbers show?
10. Why wasn't the speed difference dramatic on our small data? What's the lesson?
11. If you ran *two* copies of the server, would the atomic claim still work? Why?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. Outcome depends on the timing of overlapping actions, like two people grabbing the last slice.
2. Both read "available" before either writes "claimed."
3. The database matches and updates in one indivisible step, so only one request can match.
4. `Promise.all` starts them together. A `for` + `await` loop runs them one after another, which hides the bug.
5. 404: id doesn't exist. 409: already claimed. 403: a donor trying to claim.
6. 404 reveals nothing about someone else's data.
7. Returns the updated document. Without it you get the old version.
8. available -> claimed -> completed; available/claimed -> cancelled. The filters in each handler.
9. Collection scan reads everything; index scan reads what it needs. Your numbers: ~20,000 vs ~15 examined.
10. Small data is fast either way. Measure before optimising.
11. Yes. The atomicity lives in the database, not the server's memory. That's why it scales.

</details>

### 🤖 Use AI like this

- *"Explain race conditions with a real-world analogy. Then show me, in 15 lines, a race condition in Node and how to fix it. I'll then check my own AnnaSeva claim code."*
- *"Here's my `claimListing`. Could any sequence of requests make it claim twice? Try to break it, and explain how."*
- *"Interpret this `explain('executionStats')` output for me line by line: [paste]."*
- *"Quiz me: give me 5 scenarios and I'll say which HTTP status each should return."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| `findById` then `.save()` for claims | Race test shows several `200`s | `findOneAndUpdate` with conditions in the filter |
| Forgetting `{ returnDocument: 'after' }` | Response shows the *old* status | Add it |
| Race test with `await` in a loop | Always passes, even on the broken code | Build the array first, then `Promise.all` |
| Not populating `donor` | Front end can't show names later | `.populate('donor', 'name organization')` |
| `/:id/...` without `validateId` | Cast errors and 500s | Add `validateId` |
| Running `seed.js` on production | Real data deleted | The `_dev` guard + `--force` flag exist for this |
| Committing the broken handler | Bug lives on in your history | `git restore` before committing |
| Dropping an index and forgetting to restore it | Slow queries later | `Listing.syncIndexes()` rebuilds |

### Definition of done

- [ ] Race test: **1 x `200`, 19 x `409`** on the atomic version
- [ ] You *saw* more than one `200` on the broken version (note it in the journal)
- [ ] Complete and cancel work with correct `404`/`409`
- [ ] Seed script works and demo data appears in `/nearby`
- [ ] Lab numbers recorded; decision logged
- [ ] You can explain atomicity without notes

### Git checkpoint

```bash
git add server/middleware/validateId.js
git commit -m "feat: validate object ids on listing routes"
git add server/scripts/seed.js
git commit -m "feat(scripts): seed script with demo users and listings"
git add server/controllers server/routes
git commit -m "feat(listings): atomic claim plus complete and cancel"
git add server/scripts/race-test.js server/scripts/explain-lab.js
git commit -m "test: race-condition script and index explain lab"
git add docs && git commit -m "docs: record atomic-claim decision and lab results"
git switch main && git merge feature/claim && git push
```

### Explain-back

> "Claiming is a race: two NGOs can click at the same moment. I made the claim a single `findOneAndUpdate` whose filter says 'only if still available and not expired', so MongoDB applies it to one request at a time and the others get a 409. I proved it with a script that fires 20 simultaneous claims: exactly one wins. Because the guarantee lives in the database, it would still hold if I ran several servers."

### Resources

- [MongoDB: `findOneAndUpdate`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/)
- [MongoDB: Read/write atomicity on a single document](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
- [MongoDB: Analyze query performance (`explain`)](https://www.mongodb.com/docs/manual/tutorial/analyze-query-plan/)
- [MDN: `Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: HTTP 409 Conflict](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409)

---

## Day 5: React, Login Screens and the First Deploy

### Goal

By the end of today:

- A React app (Vite + Tailwind + React Router) runs locally and talks to your API.
- **Register, login, logout** work, and your session **survives a page refresh**.
- Pages are **protected by role** (donors and NGOs see different areas).
- **First deploy:** API on Render, database on Atlas, client on Vercel. **You can log in on a live URL.**

> Deploying early on purpose: first-time deployment problems are far easier to fix when the app is tiny. After today, every deploy is just "git push."

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1.5 h | React basics (below); skim react.dev "Quick Start" |
| Build 1 | 2 h | Steps A and B (setup, plumbing) |
| Build 2 | 1.5 h | Step C (pages) and local tests |
| Deploy | 2 h | Step E (Render, Vercel, CORS) |
| Reflect | 1 h | Self-ask, explain-back, weekly honesty check |

### Concepts to learn first

1. 🟢 **Single-page app (SPA).** The browser loads one HTML page once; React swaps what's on screen as you navigate, without full reloads. **Analogy:** a stage where scenery changes while the theatre stays the same.
2. 🟢 **Components.** A component is a function that returns what to show. **Analogy:** Lego bricks. `ListingCard` is a brick; a page is bricks assembled together.
3. 🟢 **JSX.** HTML-looking syntax inside JavaScript. Rules: `className` instead of `class`; one root element per component; `{ }` embeds JavaScript.
4. 🟢 **Props vs. state.**
   - **Props** are inputs a parent passes to a child (like function arguments). Read-only.
   - **State** is a component's own memory (`useState`). When it changes, React **re-renders** (redraws) the component.
5. 🟢 **`useEffect`.** Runs code *after* the screen draws: fetch data, start timers. The dependency array controls *when*: `[]` means "once, on first show"; `[x]` means "whenever x changes".
6. 🟢 **Context.** **Analogy:** a shared backpack any component in the tree can reach into, so you don't pass "who's logged in" through ten layers of props. Our `AuthContext` is exactly that.
7. 🟢 **Controlled inputs.** The input's value lives in React state. Every keystroke calls `setState`; React is the single source of truth for the form.
8. 🟢 **React Router.** Maps URLs to components. `<Link>` navigates without reloading; `useNavigate()` navigates from code; `<Navigate>` redirects.
9. 🟢 **Axios instance + interceptor.** An *interceptor* is a hook that runs on every request: ours attaches `Authorization: Bearer <token>` once, so no page repeats that.
10. 🟢 **CORS.** Browsers follow the **same-origin policy**: a page from `app.vercel.app` may not read responses from `api.onrender.com` unless that server says "I allow `app.vercel.app`." The server's `cors({ origin })` is that permission slip. **Thunder Client isn't a browser, so it ignores CORS.** That's why the API worked there but can fail in the browser.
11. 🟡 **Preflight.** When a request has custom headers (like `Authorization`), the browser first sends an invisible `OPTIONS` request asking "may I?" The `cors()` middleware answers it. You'll see these in the Network tab.
12. 🟡 **Vite environment variables.** Only variables starting with `VITE_` reach the browser code, and they are **baked into the build**. Two consequences: they are **public** (never put secrets there), and changing one on Vercel requires a **redeploy**.
13. 🟡 **Build vs. run.** Vercel *builds* your React app once into static files, then serves them. Render *runs* your server continuously.
14. 🟡 **Component-level protection is UX only.** `ProtectedRoute` hides pages from the wrong users, but real security is the server's `protect` and `restrictTo`.

### Requirements before you start

- [ ] Day 4 merged to `main` and pushed
- [ ] Your API runs locally and `/auth/register` works in Thunder Client
- [ ] Accounts for Render and Vercel exist

### Step-by-step actions

#### A. Create the client

1. `git switch -c feature/client-setup`
2. From the **repo root**:
   ```bash
   npm create vite@latest client -- --template react
   cd client
   npm install
   npm install react-router axios tailwindcss @tailwindcss/vite
   ```
   If the tool asks extra questions, choose **React + JavaScript** and decline experimental options and "start now."
3. Configure Tailwind (see **Key code**: `vite.config.js` and `index.css`).
4. Delete template leftovers: `src/App.css`, the sample logos, and the sample content in `App.jsx`.
5. Create `client/.env` and `client/.env.example` (below).
6. Run `npm run dev`. Open `http://localhost:5173`. Server's `CLIENT_URL` must be exactly this.

#### B. Auth plumbing

7. Create `services/api.js` (Axios + interceptors).
8. Create `utils/errors.js` (turns server errors into readable messages).
9. Create `context/AuthContext.jsx`.
10. Create `components/Loader.jsx` and `components/ProtectedRoute.jsx`.
11. Update `main.jsx` and `App.jsx` (providers and routes).

#### C. Pages

12. Create `pages/Login.jsx` (code below). Then **write `pages/Register.jsx` yourself: this is your first exercise.** Copy `Login.jsx` and change three things: (a) the form state becomes `{ name, email, password, role, organization }`; (b) add a `name` input and a `<select>` for `role` with the two values `donor` and `ngo` (exactly these lowercase words: the server's Zod schema rejects anything else); (c) on submit call `register(form)` from `useAuth()` instead of `login(...)`. `register` is already in `AuthContext` and takes the whole form object. Use the same loading and error handling as Login.
13. Create very simple placeholders (a heading is enough): `DonorDashboard.jsx` ("Welcome, {name}, donor"), `NgoNearby.jsx`, and these two:
    ```jsx
    // pages/Landing.jsx: replaced with the real landing page on Day 9
    export default function Landing() {
      return <main className="p-6"><h1 className="text-2xl font-bold">AnnaSeva</h1></main>;
    }
    ```
    ```jsx
    // pages/NotFound.jsx: shown for any URL no route matched
    import { Link } from 'react-router';

    export default function NotFound() {
      return (
        <main className="p-6">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <Link to="/" className="mt-2 inline-block underline">Back to the home page</Link>
        </main>
      );
    }
    ```
14. Create a minimal `components/Navbar.jsx` with Login/Register links, or the user's name and a Logout button. (Day 6 expands it.)

#### D. Test locally

15. Run the test table below. Open DevTools **Network** and **Application > Local Storage** while testing.

#### E. First deploy

16. **Atlas:** *Network Access > Add IP Address > Allow Access From Anywhere* (`0.0.0.0/0`). Render's free tier has no fixed IP. (The database is still protected by username, password and TLS. A stricter setup uses static IPs, which cost money.)
17. **Production database name:** your production connection string uses `annaseva` (no `_dev`), e.g. `...mongodb.net/annaseva?retryWrites=true&w=majority`.
18. Push everything to GitHub (`git switch main && git merge feature/client-setup && git push`).
19. **Render (API):** *New > Web Service*, connect your GitHub repo, then:

    | Setting | Value |
    |---|---|
    | Root Directory | `server` |
    | Build Command | `npm install` |
    | Start Command | `npm start` |
    | Instance type | Free |
    | Env var `MONGO_URI` | production connection string |
    | Env var `JWT_SECRET` | a **new** random secret (not the dev one) |
    | Env var `NODE_ENV` | `production` |
    | Env var `CLIENT_URL` | add after step 21 |

    Do **not** set `PORT`: Render provides it, and your code reads it. After the deploy, open `https://<your-service>.onrender.com/api/health`.
20. **Vercel (client):** *Add New > Project*, import the repo, set **Root Directory** to `client`, framework preset **Vite**, env var `VITE_API_URL = https://<your-service>.onrender.com/api`. Add `client/vercel.json` (below) *before* deploying.
21. Copy the Vercel URL (e.g. `https://annaseva-xyz.vercel.app`). In Render, set `CLIENT_URL` to it, **exactly: `https://`, no trailing slash**. Render redeploys.
22. Test on the live site: register, log in, refresh, log out. Then open it on your **phone**.
23. In `docs/decisions.md` add: "Deploy a skeleton early" (3 lines).

### Key code

**`client/vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Plugins extend what Vite can do. "react" understands JSX; "tailwindcss" generates utility classes.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`client/src/index.css`**

```css
/* This single line loads all of Tailwind's utility classes. */
@import "tailwindcss";
```

**`client/.env`** and **`client/.env.example`**

```bash
# Where the API lives. Must start with VITE_ to be visible in browser code. NOT a secret.
VITE_API_URL=http://localhost:5000/api
# Used on Day 8 for Socket.IO (the server's origin, with no /api)
VITE_SOCKET_URL=http://localhost:5000
```

**`client/vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Why: React Router handles URLs *in the browser*. If you refresh on `/donor`, Vercel's server looks for a file called `donor`, finds nothing, and returns a 404. This rule says "for any URL, serve `index.html`, and let React Router take over."

**`client/src/services/api.js`**

```js
import axios from 'axios';

// ONE configured Axios instance used by every page. Change the server address in one place.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// REQUEST INTERCEPTOR: runs before EVERY request leaves the browser.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('annaseva_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // the "wristband"
  }
  return config;
});

// RESPONSE INTERCEPTOR: runs on every response (or error) coming back.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth/login') || error.config?.url?.startsWith('/auth/register');
    // A 401 on a normal request means the token expired or is invalid: clear it and go to login.
    // (A 401 from the login form itself just means "wrong password": the page shows that message.)
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('annaseva_token');
      localStorage.removeItem('annaseva_user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**`client/src/utils/errors.js`**

```js
// Turns any error into a short sentence a human can read.
export function getErrorMessage(err) {
  if (err.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection and try again.';

  const data = err.response?.data;
  if (data?.errors?.length) {
    // Validation errors from Zod: "field: message, field: message"
    return data.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
  }
  return data?.message || err.message || 'Something went wrong';
}
```

**`client/src/context/AuthContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'annaseva_token';
const USER_KEY = 'annaseva_user';

// createContext makes the "shared backpack". null is the default when no provider exists.
const AuthContext = createContext(null);

// Read the saved user from the browser's storage (it may be missing or corrupted).
function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Passing a FUNCTION to useState means it runs only once, on the first render.
  const [user, setUser] = useState(readSavedUser);
  // "loading" is true until we've double-checked the saved token with the server.
  const [loading, setLoading] = useState(true);

  // On first load: if a token exists, ask the server "who am I?" to confirm it's still valid.
  useEffect(() => {
    async function confirmSession() {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        clearSession(); // token expired or tampered with
      } finally {
        setLoading(false); // finally runs whether it worked or failed
      }
    }
    confirmSession();
  }, []); // [] = run once, when the app first appears

  function saveSession({ token, user }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user)); // storage only holds text, hence stringify
    setUser(user);
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
    return data.user;
  }

  async function register(form) {
    const { data } = await api.post('/auth/register', form);
    saveSession(data);
    return data.user;
  }

  // Everything inside value={...} becomes available to any component calling useAuth().
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout: clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// A small custom hook so components write useAuth() instead of useContext(AuthContext).
export function useAuth() {
  return useContext(AuthContext);
}
```

**`client/src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

// Wrap a page in <ProtectedRoute role="donor"> to restrict who can see it.
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // While we are still checking the saved token, show a spinner.
  // WITHOUT this, a logged-in user would flash the login page on every refresh.
  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;                       // not logged in
  if (role && user.role !== role) return <Navigate to="/" replace />;       // wrong role

  return children;
}
```

**`client/src/components/Loader.jsx`**

```jsx
export default function Loader({ text = 'Loading...' }) {
  return <p className="p-6 text-center text-gray-500" role="status">{text}</p>;
}
```

**`client/src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Order matters: the Router and AuthProvider wrap App so every component can use them.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

> **StrictMode** deliberately runs some code twice in development to expose bugs. In dev you may see `useEffect` fire twice. That's expected and does not happen in production. It's why effects that start things must also *clean up* (Day 8).

**`client/src/App.jsx`**

```jsx
import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import NgoNearby from './pages/NgoNearby';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-protected pages: the real security is on the server; this is for a clean experience. */}
        <Route path="/donor" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
        <Route path="/ngo" element={<ProtectedRoute role="ngo"><NgoNearby /></ProtectedRoute>} />

        {/* path="*" matches anything else */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
```

**`client/src/pages/Login.jsx`**

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Controlled inputs: React state is the single source of truth for what's typed.
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // One handler for every input: the input's "name" attribute picks which field to update.
  function handleChange(e) {
    setForm((previous) => ({ ...previous, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default full-page form submit
    setError('');
    setSubmitting(true); // disables the button so a double-click can't send two requests
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'donor' ? '/donor' : '/ngo', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-bold">Log in</h1>

      {/* role="alert" makes screen readers announce the error */}
      {error && <p role="alert" className="mt-3 rounded bg-red-50 p-2 text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email"
            value={form.email} onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input name="password" type="password" required autoComplete="current-password"
            value={form.password} onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 p-2" />
        </label>
        <button type="submit" disabled={submitting}
          className="w-full rounded bg-green-600 p-2 font-medium text-white disabled:opacity-50">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        New here? <Link to="/register" className="text-green-700 underline">Create an account</Link>
      </p>
    </main>
  );
}
```

**`Register.jsx`** follows the same pattern. Differences (write it yourself, then compare with AI review):

- Fields: `name`, `email`, `password`, `organization` (optional), and `role` as two radio buttons: **"I'm a donor (I have surplus food)"** and **"I'm an NGO (I collect food)"**.
- Calls `register(form)` instead of `login(...)`.
- Sends `organization` only when filled in.
- Same loading and error handling.

### Test it (locally first)

| # | Check | Expected |
|---|---|---|
| 1 | Register as a donor | Redirected to `/donor` placeholder; Local Storage has `annaseva_token` and `annaseva_user` |
| 2 | Refresh the page | Still logged in; no flash of the login page |
| 3 | Log out | Redirected/sent to login; Local Storage cleared |
| 4 | Log in with a wrong password | Red error message, page does **not** reload |
| 5 | Register with a short password | Server's validation message is shown |
| 6 | Visit `/donor` while logged out | Redirected to `/login` |
| 7 | Log in as an NGO, visit `/donor` | Redirected away |
| 8 | Network tab: `GET /auth/me` | Has `Authorization: Bearer ...` request header |
| 9 | Edit the token in Local Storage, refresh | Logged out cleanly |
| 10 | Stop the server and try to log in | "Cannot reach the server..." message |

### Test it (live)

| # | Check | Expected |
|---|---|---|
| 11 | `https://<render>/api/health` | `200` JSON (the first call may take up to a minute: free tier "cold start") |
| 12 | Vercel site: register, log in | Works |
| 13 | Refresh on `/donor` on Vercel | Page loads (not a 404). If 404, check `vercel.json` |
| 14 | Same on your phone | Works |
| 15 | Browser console on the live site | No red CORS errors |
| 16 | Atlas > `annaseva` database | A `users` collection with your live registration |

### 🧠 Self-ask questions

1. What is a component? How is it different from a page?
2. What's the difference between **props** and **state**? What happens when state changes?
3. Explain `useEffect(() => {...}, [])`. What would change with `[user]`?
4. What problem does Context solve here? What would we do without it?
5. Why do we keep React state *and* `localStorage` for the user?
6. What does the Axios interceptor do, and why is it better than adding the header in every page?
7. What is CORS? Why did Thunder Client work but the browser may not?
8. Why does `CLIENT_URL` have to match the Vercel URL exactly?
9. Why must `ProtectedRoute` check `loading` first?
10. Is `ProtectedRoute` real security? Where does the real security live?
11. Why do `VITE_` variables require a redeploy when they change? Are they secret?
12. What's the difference between Render's job and Vercel's job?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. A reusable function that returns UI. A page is a component that represents a whole screen.
2. Props come from the parent, read-only. State is the component's own memory; changing it re-renders.
3. Runs once after the first render. With `[user]` it re-runs every time `user` changes.
4. Avoids passing the user through many layers (prop drilling).
5. State drives the screen; storage survives refreshes.
6. It adds the token on every request automatically: one place, no repetition.
7. Browsers enforce the same-origin policy. Servers opt in with CORS headers. Thunder Client isn't a browser.
8. The browser compares origins as exact strings, including `https` and the lack of a trailing slash.
9. Otherwise a logged-in user is briefly seen as "not logged in" and redirected.
10. No, it only hides pages. The server's `protect` and `restrictTo` are the real checks.
11. They're baked into the built JavaScript at build time. They're public, never secrets.
12. Render runs the API continuously. Vercel builds and serves the static React files.

</details>

### 🤖 Use AI like this

- *"Explain React state and re-rendering using a whiteboard analogy. Then show a tiny counter example and quiz me."*
- *"Walk me through exactly what happens, step by step, from page refresh to my user appearing in `AuthContext`."*
- *"I got this CORS error: [paste exact text]. Explain in plain English what the browser is protecting against and list the 3 most likely causes in my setup."*
- *"Review my `Register.jsx` as a senior dev. Don't rewrite it; rank the issues."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| `class` instead of `className` | Console warning, styles missing | Use `className` |
| Forgetting `e.preventDefault()` | Page reloads on submit | Add it in `handleSubmit` |
| Changing state directly (`form.email = ...`) | Screen doesn't update | Use the setter with a **new** object |
| `useEffect` with `setState` and no dependency array | Infinite loop, browser freezes | Add `[]` or the right dependencies |
| `VITE_` prefix missing | `import.meta.env.X` is `undefined` | Rename to `VITE_X`, restart dev server |
| Changed Vercel env var but didn't redeploy | Old URL still used | Redeploy |
| `CLIENT_URL` with trailing slash or `http` | CORS error | Match the browser's address bar origin exactly |
| `Navbar.jsx` imported as `./navbar` | Works on Windows/Mac, **fails on Vercel (Linux)** | Match capitalisation exactly |
| Tailwind classes have no effect | Unstyled page | Check the `@import` line and the plugin in `vite.config.js`, restart |
| Expecting the Render URL to respond instantly | 30 to 60 s delay | Free-tier cold start. Normal |
| 401 interceptor redirecting on login failure | Error message never visible | Exclude `/auth/login` (done in the code above) |

### Definition of done

- [ ] All 16 test rows pass
- [ ] You can log in on the **live Vercel URL** on your phone
- [ ] `.env` files aren't in GitHub; `.env.example` files are
- [ ] You can explain CORS in your own words
- [ ] Weekly honesty check done (Section 10.5)

### Git checkpoint

```bash
git add client
git commit -m "feat(client): scaffold React app with Tailwind and router"
git add client/src/services client/src/utils client/src/context client/src/components
git commit -m "feat(client): auth context, api service and protected routes"
git add client/src/pages client/src/App.jsx
git commit -m "feat(client): login and register pages"
git add client/vercel.json
git commit -m "chore(deploy): add Vercel SPA rewrite"
git switch main && git merge feature/client-setup && git push
```

### Explain-back

> "The React app keeps the logged-in user in a Context, backed by localStorage so refreshes keep the session. An Axios interceptor attaches the JWT to every request. ProtectedRoute redirects by role for a smooth experience, but the real checks are on the server. I deployed early: Render runs the API, Vercel serves the built React app, Atlas hosts the data, and CORS is configured so the browser allows the two origins to talk."

### Resources

- [React: Quick Start](https://react.dev/learn) and [Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: `useEffect`](https://react.dev/reference/react/useEffect)
- [React Router documentation](https://reactrouter.com/)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Render: Deploy a Node/Express app](https://render.com/docs/deploy-node-express-app)
- [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite)

---

## Day 6: The Donor Experience

### Goal

By the end of today a donor can, **entirely in the browser**:

- Post a listing (with their location, quantity and expiry).
- See their listings, grouped by status.
- Mark a claimed listing as **picked up**, or **cancel** a listing.
- Use a navbar that changes with the user's role.

You'll also build the reusable UI pieces (`Loader`, `ErrorMessage`, `EmptyState`, `Notice`, `StatusBadge`, `ListingCard`) that Day 7 reuses.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1 h | Four-states pattern, keys, geolocation, time zones |
| Build 1 | 2 h | Reusable components, helpers, navbar |
| Build 2 | 2.5 h | `useGeolocation`, `NewListing`, `DonorDashboard` |
| Test + deploy | 1 h | Test table; push; test live |
| Reflect | 1 h | Self-ask, explain-back |

### Concepts to learn first

1. 🟢 **The four states of every data screen.** Any screen that loads data must handle: **loading** (spinner), **error** (message + retry), **empty** ("nothing here yet" + what to do), and **data**. Beginners build only the last one, and the app looks broken whenever the server is slow or empty.
2. 🟢 **Lists and `key`.** When rendering `listings.map(...)`, each item needs a stable, unique `key={listing._id}` so React can track items as the list changes. Don't use the array index when items can be removed or reordered.
3. 🟢 **The server is the source of truth.** After a donor clicks "Cancel," we don't *guess* the new state: we replace the item in our list with the listing the **server returned**. (Doing it the "pessimistic" way means it can't lie to the user.)
4. 🟢 **Browser Geolocation.** `navigator.geolocation.getCurrentPosition` asks the user's permission, then returns latitude/longitude. It can be **denied**, **time out**, or be **imprecise** (especially on desktops). It only works on **secure contexts** (HTTPS or localhost), which is another reason to deploy to Vercel.
5. 🟢 **Custom hooks.** A function starting with `use` that bundles reusable stateful logic. `useGeolocation` hides all the location code; Day 7 reuses it.
6. 🟢 **Dates and time zones.** An `<input type="datetime-local">` gives a string like `2026-10-25T18:30` with **no time zone**: it means "18:30 *where the user is*". `new Date(thatString).toISOString()` converts it to **UTC** for sending. **Store and send UTC; display in local time.** Mixing these is a top source of "my listing expired instantly" bugs.
7. 🟡 **Derived state.** "Expired" isn't stored. A tiny helper computes it from `status` and `expiresAt`, so it can't go out of date.
8. 🟡 **Client validation is for kindness; server validation is for safety.** Show the server's validation messages in the UI. Don't duplicate every rule on the client.

### Requirements before you start

- [ ] Day 5 deployed; login works live
- [ ] You can run both servers locally
- [ ] `node scripts/seed.js` has created demo data (optional but helpful)

### Step-by-step actions

1. `git switch -c feature/donor-ui`
2. Create `utils/format.js` (below).
3. Create small components: `Notice`, `ErrorMessage`, `EmptyState`, `StatusBadge`, `ListingCard`.
4. Replace `Navbar.jsx` with the role-aware version.
5. Create `hooks/useGeolocation.js`.
6. Build `pages/NewListing.jsx`.
7. Build `pages/DonorDashboard.jsx` with the four-states pattern and actions.
8. Add the route in `App.jsx`: import the page at the top (`import NewListing from './pages/NewListing';`) and add this line next to the other donor route:
   ```jsx
   <Route path="/donor/new" element={<ProtectedRoute role="donor"><NewListing /></ProtectedRoute>} />
   ```
9. Run the test table. Watch the **Network** tab: look at the payload your form sends and the response.
10. Push to `main`. Wait for Vercel and Render to redeploy, and repeat three key tests **live**.
11. Add `docs/decisions.md` entry: "UI waits for the server instead of guessing results."

### Key code

**`client/src/utils/format.js`**

```js
// "2026-10-25T18:30" in the format <input type="datetime-local"> needs, in LOCAL time.
export function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0'); // 7 -> "07"
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// "Expired", "45 min left", "2h 10m left"
export function timeLeft(expiresAt) {
  const ms = new Date(expiresAt) - Date.now();
  if (ms <= 0) return 'Expired';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} min left`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m left`;
}

// Derived status: an "available" listing past its expiry is shown as "expired".
export function displayStatus(listing) {
  if (listing.status === 'available' && new Date(listing.expiresAt) < new Date()) return 'expired';
  return listing.status;
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); // user's local time
}
```

**`client/src/components/StatusBadge.jsx`**

```jsx
// Lookup table: status -> Tailwind colour classes. Easier to read than a chain of if/else.
const STYLES = {
  available: 'bg-green-100 text-green-800',
  claimed: 'bg-amber-100 text-amber-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-200 text-gray-700',
  expired: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status] || STYLES.cancelled}`}>
      {status}
    </span>
  );
}
```

**`client/src/components/ListingCard.jsx`**

```jsx
import StatusBadge from './StatusBadge';
import { displayStatus, formatDateTime, timeLeft } from '../utils/format';

// "children" lets each page put its OWN buttons inside the card (Cancel for donors, Claim for NGOs).
export default function ListingCard({ listing, children }) {
  const status = displayStatus(listing);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{listing.title}</h3>
        <StatusBadge status={status} />
      </div>

      <p className="mt-1 text-sm text-gray-600">
        {listing.quantity} meals, {listing.foodType}
      </p>
      {listing.description && <p className="mt-1 text-sm">{listing.description}</p>}

      <p className="mt-2 text-sm text-gray-600">Pickup: {listing.pickupAddress}</p>
      <p className="text-sm text-gray-600">
        Expires {formatDateTime(listing.expiresAt)} ({timeLeft(listing.expiresAt)})
      </p>

      {/* Optional extras: who claimed it */}
      {listing.claimedBy?.name && (
        <p className="mt-1 text-sm">Claimed by: {listing.claimedBy.organization || listing.claimedBy.name}</p>
      )}

      {children && <div className="mt-3 flex flex-wrap gap-2">{children}</div>}
    </article>
  );
}
```

**`client/src/components/Notice.jsx`, `ErrorMessage.jsx`, `EmptyState.jsx`**

```jsx
// Notice.jsx: a short message that screen readers announce. The parent decides when to clear it.
export default function Notice({ message, onClose }) {
  if (!message) return null;
  return (
    <div role="status" className="mb-3 flex items-center justify-between rounded bg-blue-50 p-2 text-blue-800">
      <span>{message}</span>
      {onClose && <button onClick={onClose} aria-label="Dismiss" className="px-2">x</button>}
    </div>
  );
}

// ErrorMessage.jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="rounded bg-red-50 p-3 text-red-700">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry} className="mt-2 underline">Try again</button>}
    </div>
  );
}

// EmptyState.jsx: tell the user what is missing AND what to do next
export default function EmptyState({ title, hint, children }) {
  return (
    <div className="rounded border border-dashed border-gray-300 p-8 text-center text-gray-600">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
      {children}
    </div>
  );
}
```
(Each of the three goes in its own file with `export default`.)

**`client/src/components/Navbar.jsx`**

```jsx
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 bg-green-700 px-4 py-3 text-white">
      <Link to="/" className="text-lg font-bold">AnnaSeva</Link>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        {!user && (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user?.role === 'donor' && (
          <>
            <Link to="/donor">My listings</Link>
            <Link to="/donor/new">Post food</Link>
          </>
        )}
        {user?.role === 'ngo' && (
          <>
            <Link to="/ngo">Find food</Link>
            <Link to="/ngo/claims">My claims</Link>
          </>
        )}
        {user && (
          <>
            <span className="opacity-80">{user.name}</span>
            <button onClick={handleLogout} className="underline">Log out</button>
          </>
        )}
      </div>
    </nav>
  );
}
```

**`client/src/hooks/useGeolocation.js`**

```js
import { useState, useCallback } from 'react';

// A custom hook: reusable "get the user's location" logic with loading and error state.
export default function useGeolocation() {
  const [coords, setCoords] = useState(null);   // { lat, lng } once we have it
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useCallback keeps the same function between renders (so it's safe in dependency arrays).
  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Your browser does not support location.');
      return;
    }
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {                                         // success callback
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoading(false);
      },
      (err) => {                                              // failure callback (denied, timeout...)
        setError(err.code === 1 ? 'Location permission was denied.' : 'Could not get your location.');
        setLoading(false);
      },
      { timeout: 10000 }                                      // give up after 10 seconds
    );
  }, []);

  return { coords, error, loading, locate };
}
```

**`client/src/pages/NewListing.jsx`**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import useGeolocation from '../hooks/useGeolocation';
import { getErrorMessage } from '../utils/errors';
import { toLocalInputValue } from '../utils/format';

// Build default form values: prepared now, expires in 3 hours.
function makeInitialForm() {
  const now = new Date();
  return {
    title: '',
    description: '',
    foodType: 'veg',
    quantity: 10,
    preparedAt: toLocalInputValue(now),
    expiresAt: toLocalInputValue(new Date(now.getTime() + 3 * 60 * 60 * 1000)),
    pickupAddress: '',
  };
}

const inputClass = 'mt-1 w-full rounded border border-gray-300 p-2';

export default function NewListing() {
  const navigate = useNavigate();
  const { coords, error: geoError, loading: geoLoading, locate } = useGeolocation();
  const [form, setForm] = useState(makeInitialForm); // function form = computed once
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!coords) {
      setError('Please share your pickup location first.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/listings', {
        title: form.title,
        description: form.description || undefined,       // omit when empty
        foodType: form.foodType,
        quantity: Number(form.quantity),                  // inputs always give text; convert
        // datetime-local has no time zone: new Date() reads it as LOCAL time, toISOString() gives UTC
        preparedAt: new Date(form.preparedAt).toISOString(),
        expiresAt: new Date(form.expiresAt).toISOString(),
        pickupAddress: form.pickupAddress,
        latitude: coords.lat,
        longitude: coords.lng,
      });
      navigate('/donor');
    } catch (err) {
      setError(getErrorMessage(err)); // shows the server's validation messages
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-4">
      <h1 className="text-2xl font-bold">Post surplus food</h1>
      {error && <p role="alert" className="mt-3 rounded bg-red-50 p-2 text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium">What is it?</span>
          <input name="title" required minLength={3} value={form.title} onChange={handleChange} className={inputClass} />
        </label>

        {/* TODO for you: description textarea, foodType select (veg / non-veg / vegan / mixed),
            quantity number input (min 1), preparedAt and expiresAt (type="datetime-local"),
            pickupAddress text input. Follow the same pattern as "title" above. */}

        <div className="rounded border border-gray-200 p-3">
          <button type="button" onClick={locate} disabled={geoLoading} className="rounded bg-gray-100 px-3 py-1">
            {geoLoading ? 'Finding you...' : coords ? 'Update my location' : 'Use my current location'}
          </button>
          {coords && <p className="mt-2 text-sm text-green-700">Location saved ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})</p>}
          {geoError && <p className="mt-2 text-sm text-red-700">{geoError}</p>}
        </div>

        <button type="submit" disabled={submitting} className="w-full rounded bg-green-600 p-2 font-medium text-white disabled:opacity-50">
          {submitting ? 'Posting...' : 'Post listing'}
        </button>
      </form>
    </main>
  );
}
```

**`client/src/pages/DonorDashboard.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import { getErrorMessage } from '../utils/errors';
import { displayStatus } from '../utils/format';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';

export default function DonorDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);  // state 1: loading
  const [error, setError] = useState('');        // state 2: error
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/listings/mine');
      setListings(data.listings);                 // state 4: data (state 3, empty, is checked in the JSX)
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // action is 'complete' or 'cancel'. The server decides if it's allowed.
  async function act(id, action) {
    if (action === 'cancel' && !window.confirm('Cancel this listing?')) return;
    try {
      const { data } = await api.patch(`/listings/${id}/${action}`);
      // Replace just this listing with the server's version. All others stay as they are.
      setListings((previous) => previous.map((l) => (l._id === id ? data.listing : l)));
      setNotice(action === 'complete' ? 'Marked as picked up. Thank you!' : 'Listing cancelled.');
    } catch (err) {
      setNotice(getErrorMessage(err));
    }
  }

  if (loading) return <Loader />;
  if (error) return <main className="p-4"><ErrorMessage message={error} onRetry={load} /></main>;

  const active = listings.filter((l) => ['available', 'claimed'].includes(l.status) && displayStatus(l) !== 'expired');
  const history = listings.filter((l) => !active.includes(l));

  return (
    <main className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My listings</h1>
        <Link to="/donor/new" className="rounded bg-green-600 px-3 py-2 text-white">Post food</Link>
      </div>

      <Notice message={notice} onClose={() => setNotice('')} />

      {listings.length === 0 ? (
        <EmptyState title="You haven't posted anything yet" hint="Surplus food helps someone nearby. Post your first listing.">
          <Link to="/donor/new" className="mt-3 inline-block underline">Post food</Link>
        </EmptyState>
      ) : (
        <>
          <h2 className="mt-6 font-semibold">Active</h2>
          <div className="mt-2 grid gap-3">
            {active.map((listing) => (
              <ListingCard key={listing._id} listing={listing}>
                {listing.status === 'claimed' && (
                  <button onClick={() => act(listing._id, 'complete')} className="rounded bg-blue-600 px-3 py-1 text-white">
                    Mark picked up
                  </button>
                )}
                <button onClick={() => act(listing._id, 'cancel')} className="rounded border border-red-300 px-3 py-1 text-red-700">
                  Cancel
                </button>
              </ListingCard>
            ))}
            {active.length === 0 && <p className="text-sm text-gray-600">Nothing active right now.</p>}
          </div>

          <h2 className="mt-6 font-semibold">History</h2>
          <div className="mt-2 grid gap-3">
            {history.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
          </div>
        </>
      )}
    </main>
  );
}
```

> **Your homework in this file:** the `NewListing` form has a `TODO` block for the remaining fields. Write them yourself; it's the best practice of the day. Then ask AI to review your version.

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | Log in as a donor | Navbar shows "My listings" and "Post food" only |
| 2 | Open "Post food", submit **without** sharing location | Friendly error, no request sent |
| 3 | Click "Use my current location" and allow | Coordinates appear |
| 4 | Click it and **deny** permission | Clear message, form still usable |
| 5 | Submit a valid listing | Redirected to dashboard; listing shows under **Active** |
| 6 | Network tab: inspect the POST payload | `expiresAt` ends in `Z` (UTC); `quantity` is a number |
| 7 | Submit with an expiry in the past | Server's validation message is shown |
| 8 | In Thunder Client, claim your listing as an NGO, then refresh the dashboard | Shows "Claimed by ..." and a **Mark picked up** button |
| 9 | Click **Mark picked up** | Moves to **History** as `completed` |
| 10 | Cancel an available listing (confirm dialog) | Moves to History as `cancelled` |
| 11 | Stop the server, reload the dashboard | Error message with **Try again** |
| 12 | Brand-new donor account | Empty state with a call to action |
| 13 | Browser window narrowed to phone width | Layout stays usable, no sideways scroll |
| 14 | Push to `main`; test #5 on the **live** site | Works |

### 🧠 Self-ask questions

1. What are the four states every data-loading screen should handle?
2. Why does each list item need a `key`? Why not the array index?
3. After clicking "Cancel", why do we use the listing the **server returned** instead of just setting `status: 'cancelled'` ourselves?
4. What is a custom hook? What does `useGeolocation` hide from the page?
5. What can go wrong with the Geolocation API? Which of those did you handle?
6. What is a time zone bug? What does `new Date(local).toISOString()` do?
7. Why isn't "expired" a stored status?
8. Why does the client send `Number(form.quantity)`?
9. Who actually stops a donor from cancelling someone else's listing: the button's absence or the server? Why?
10. Why does the dashboard separate "Active" from "History"?
11. Where would the user see a slow server in your UI?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. Loading, error, empty, data.
2. React tracks items across re-renders by key. Indexes shift when items move or disappear.
3. The server is the source of truth and may have changed things we didn't know about (a conflict).
4. Reusable logic that uses state. It hides permission handling, callbacks, loading and error state.
5. Permission denied, timeout, unsupported browser, imprecision. Denied/unsupported/timeouts are handled.
6. Treating a local time as UTC (or vice versa) shifts times by hours. `toISOString` converts to UTC.
7. It can be computed from `expiresAt`, so storing it risks staleness and needs a background job.
8. Form inputs always yield strings.
9. The server (`donor: req.user.id` in the filter). Hiding a button is only UX.
10. Different jobs: act on active ones; look back at history.
11. The Loader on first load; disabled buttons during actions. (Could be improved.)

</details>

### 🤖 Use AI like this

- *"Explain the 'four states' pattern for data screens. Show me where each one appears in my `DonorDashboard`."*
- *"Explain time zones in web apps like I'm five: why does `datetime-local` not include a zone and how do I avoid the classic bug?"*
- *"Here's my version of the missing form fields. Review for accessibility (labels, types, required) and mistakes. Don't rewrite."*
- *"Why do I need `key` in a list? Show me a bug that happens without it."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Sending `datetime-local` strings directly | Times are off by hours, listings "expire" immediately | Convert with `new Date(...).toISOString()` |
| `key={index}` | Wrong item updates after cancel | `key={listing._id}` |
| Mutating state (`listings.push(...)`) | UI doesn't update | Create a new array/object with the setter |
| Only building the "data" state | Blank screen when slow/empty/failing | Add loading, error, empty |
| Not disabling the submit button | Duplicate listings from double-clicks | `disabled={submitting}` |
| Missing `type="button"` on non-submit buttons inside a form | Clicking "Use location" submits the form | Add `type="button"` |
| Geolocation on plain `http://` (not localhost) | Always denied | Use `https` (Vercel does) |
| Forgetting to import a component | `X is not defined` | Check imports |
| Wrong path to `api` service | Module not found | Check relative paths and capitalisation |

### Definition of done

- [ ] All 14 test rows pass (including the live check)
- [ ] The missing form fields are written by **you**
- [ ] You can explain time-zone handling in one sentence
- [ ] You can explain why the server decides, not the button

### Git checkpoint

```bash
git add client/src/utils client/src/components
git commit -m "feat(client): reusable UI components and format helpers"
git add client/src/hooks client/src/pages/NewListing.jsx client/src/App.jsx
git commit -m "feat(client): donor can post a listing with their location"
git add client/src/pages/DonorDashboard.jsx
git commit -m "feat(client): donor dashboard with complete and cancel"
git switch main && git merge feature/donor-ui && git push
```

### Explain-back

> "Every data screen handles loading, error, empty and data states. The donor's form converts local times to UTC and takes the pickup location from the browser's Geolocation API. After an action, the UI replaces the item with the server's response, because the server is the source of truth, and the server, not the hidden button, enforces ownership."

### Resources

- [React: Rendering lists (keys)](https://react.dev/learn/rendering-lists)
- [React: Reusing logic with custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [MDN: Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [MDN: `<input type="datetime-local">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local)
- [MDN: `Date.prototype.toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)

---

## Day 7: The NGO Experience (Map and Claim)

### Goal

By the end of today an NGO can, **entirely in the browser**:

- Share their location (or **click the map** to search somewhere else).
- See nearby available food on a **map and in a list**, with distances.
- Change the search radius.
- **Claim** a listing, and cope gracefully when someone else got there first.
- Open **My claims** with the pickup address and a "Get directions" link.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1 h | Leaflet, map coordinates, stale responses |
| Build 1 | 2 h | Leaflet setup, `geo.js`, `ListingMap` |
| Build 2 | 2.5 h | `NgoNearby`, `MyClaims` |
| Test + deploy | 1.5 h | Two-browser claim test, live test |
| Reflect | 1 h | Self-ask, explain-back, journal |

### Concepts to learn first

1. 🟢 **How web maps work.** A map is a grid of small square **tile images** loaded from a **tile server** (here, OpenStreetMap's). **Leaflet** is the library that positions those tiles, handles dragging and zooming, and draws markers on top. **react-leaflet** wraps Leaflet in React components. **Analogy:** tiles are the pages of a giant paper atlas; Leaflet is the person flipping to the right page as you scroll.
2. 🟢 **The coordinate flip (the #1 map bug, again).**
   - MongoDB (GeoJSON) stores `[longitude, latitude]`.
   - Leaflet wants `[latitude, longitude]`.
   - So when you draw a stored listing, you **swap** them. Put the swap in **one** helper (`listingLatLng`) and use it everywhere.
3. 🟢 **Attribution.** OpenStreetMap's data licence requires a visible credit on the map. It's included in the code below; don't remove it. Also, OSM's free tile server is meant for **light use**: fine for a portfolio demo, not for a busy product ([tile usage policy](https://operations.osmfoundation.org/policies/tiles/)).
4. 🟢 **Maps need a height.** The map container is invisible unless it has an explicit height (e.g. Tailwind's `h-80`). The blank-grey-box problem is almost always this.
5. 🟢 **Distance on a sphere (haversine).** The Earth is round, so Pythagoras doesn't work. The haversine formula gives the straight-line distance between two lat/lng points. The server already sorts by distance (via `$near`), but doesn't send the number, so we calculate it on the client for display.
6. 🟡 **Stale responses (a subtle bug).** The user changes the radius twice quickly. Two requests fly out; the *first* one might come back *last* and overwrite the newer result. Fix: number each request and ignore any answer that isn't from the latest request.
7. 🟡 **Pessimistic updates.** The Claim button waits for the server before changing the UI. Claiming is exactly the case where the server may say "no" (409), so we never pretend we won.
8. 🟡 **Graceful failure is a feature.** "Someone else claimed this" is not an error in your code; it's an expected outcome of a competitive system. The UI should explain it kindly and remove the listing.
9. 🟡 **`target="_blank"` and `rel="noopener noreferrer"`.** Links that open a new tab should include `rel="noopener noreferrer"` so the new page can't control your page through `window.opener`.
10. 🔴 **Privacy trade-off.** Right now every NGO sees the full pickup address before claiming. A stricter design shows only an approximate area until claimed. Note it in `decisions.md` as a known trade-off.

### Requirements before you start

- [ ] Day 6 deployed; `useGeolocation` works
- [ ] The seed script has created listings near **your** location (set `CENTER` in `seed.js` to your city if you haven't)
- [ ] Two NGO accounts exist (e.g. `ngo.demo@example.com` and one you register as a second NGO)

### Step-by-step actions

1. `git switch -c feature/ngo-ui`
2. Install Leaflet: `cd client && npm install leaflet react-leaflet`
   > **Version note:** `react-leaflet` v5 requires **React 19**. If your Vite template installed React 18, run `npm install react-leaflet@4` instead. Check with `npm ls react`.
3. Create `src/leafletSetup.js`, `src/utils/geo.js`, and `components/ListingMap.jsx`.
4. First, render the map alone on a throwaway page with one hard-coded marker. Confirm tiles load **and** the marker icon appears (the default icon is a known Vite problem; the setup file fixes it).
5. Build `pages/NgoNearby.jsx`: location + radius controls, map, list, claim flow, the four states.
6. Build `pages/MyClaims.jsx` and add the route `/ngo/claims` in `App.jsx`.
7. Run the test table, using **two browsers** (e.g. a normal window and an incognito window) for the claim-conflict test.
8. Push to `main`, wait for redeploys, and run tests 1, 4 and 8 on the **live** site, on your phone.
9. `docs/decisions.md`: add "Distance calculated on the client", "Pickup address visible before claim (privacy trade-off)".

### Key code

**`client/src/leafletSetup.js`**

```js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // the map's own styles (without this, tiles are scattered around the page)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite renames image files when it builds, so Leaflet can't find its default pin images by itself.
// We import them (so Vite knows about them) and give Leaflet the correct URLs.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

**`client/src/utils/geo.js`**

```js
// Convert degrees to radians (the maths below needs radians).
const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Haversine formula: straight-line distance in km between two points on Earth.
// Docs: https://en.wikipedia.org/wiki/Haversine_formula
export function distanceKm(lat1, lng1, lat2, lng2) {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

// THE ONE PLACE where we swap order. MongoDB stores [lng, lat]; Leaflet wants [lat, lng].
export function listingLatLng(listing) {
  const [lng, lat] = listing.location.coordinates;
  return [lat, lng];
}

// Friendly text: "450 m" or "3.2 km"
export function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
```

**`client/src/components/ListingMap.jsx`**

```jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import '../leafletSetup';
import { listingLatLng } from '../utils/geo';

// Moves the map when the search centre changes. Must be a CHILD of MapContainer to access the map.
function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]); // no zoom argument: keeps the user's current zoom level
  }, [map, lat, lng]);
  return null; // renders nothing visible; it only has an effect
}

// Lets the user click the map to choose a new search centre.
function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function ListingMap({ center, radiusKm, listings, onPick }) {
  return (
    // The map needs an explicit height, otherwise it is invisible.
    <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom={false}
      className="h-80 w-full rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={center.lat} lng={center.lng} />
      {onPick && <ClickToPick onPick={onPick} />}

      {/* The search area. Circle radius is in METRES. */}
      <Circle center={[center.lat, center.lng]} radius={radiusKm * 1000} pathOptions={{ color: 'green', weight: 1 }} />
      {/* "You are here": a blue dot, so it can't be confused with listing pins */}
      <CircleMarker center={[center.lat, center.lng]} radius={7} pathOptions={{ color: 'blue' }} />

      {listings.map((listing) => (
        <Marker key={listing._id} position={listingLatLng(listing)}>
          <Popup>
            <strong>{listing.title}</strong><br />
            {listing.quantity} meals
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

**`client/src/pages/NgoNearby.jsx`**

```jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import useGeolocation from '../hooks/useGeolocation';
import { getErrorMessage } from '../utils/errors';
import { distanceKm, formatDistance, listingLatLng } from '../utils/geo';
import ListingMap from '../components/ListingMap';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';

export default function NgoNearby() {
  const { coords: gpsCoords, error: geoError, loading: geoLoading, locate } = useGeolocation();

  const [center, setCenter] = useState(null);   // where we search: from GPS, or a map click
  const [radiusKm, setRadiusKm] = useState(10);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [claimingId, setClaimingId] = useState(null); // which listing is being claimed right now

  // When GPS gives us a location, use it as the search centre.
  useEffect(() => { if (gpsCoords) setCenter(gpsCoords); }, [gpsCoords]);
  // Ask for GPS once when the page opens.
  useEffect(() => { locate(); }, [locate]);

  // A counter that guards against STALE responses (see Concept 6).
  const latestRequest = useRef(0);

  const load = useCallback(async () => {
    if (!center) return;
    const requestId = ++latestRequest.current;   // number this request
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/listings/nearby', {
        params: { lat: center.lat, lng: center.lng, radiusKm }, // becomes ?lat=..&lng=..&radiusKm=..
      });
      if (requestId !== latestRequest.current) return;  // a newer request exists: ignore this old answer
      setListings(data.listings);
      setLoading(false);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }, [center, radiusKm]);

  useEffect(() => { load(); }, [load]); // reload whenever the centre or radius changes

  async function handleClaim(listing) {
    if (!window.confirm(`Claim "${listing.title}"? You're committing to collect it.`)) return;
    setClaimingId(listing._id);
    try {
      const { data } = await api.patch(`/listings/${listing._id}/claim`);
      // We won. Remove it from "available" and tell the user where to go.
      setListings((previous) => previous.filter((l) => l._id !== listing._id));
      setNotice(`Claimed "${data.listing.title}". Pickup: ${data.listing.pickupAddress}. Find it under "My claims".`);
    } catch (err) {
      setNotice(getErrorMessage(err));
      // 409 = someone else was faster, or it expired. It's gone either way: remove it.
      if (err.response?.status === 409) {
        setListings((previous) => previous.filter((l) => l._id !== listing._id));
      }
    } finally {
      setClaimingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold">Food near you</h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={locate} disabled={geoLoading} className="rounded bg-gray-100 px-3 py-1">
          {geoLoading ? 'Finding you...' : 'Use my location'}
        </button>
        <label className="text-sm">
          Radius{' '}
          <select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="rounded border border-gray-300 p-1">
            {[2, 5, 10, 25, 50].map((km) => <option key={km} value={km}>{km} km</option>)}
          </select>
        </label>
        <span className="text-sm text-gray-600">Tip: click the map to search somewhere else.</span>
      </div>
      {geoError && <p className="mt-2 text-sm text-red-700">{geoError} You can still click the map to pick a place.</p>}

      <Notice message={notice} onClose={() => setNotice('')} />

      {/* No location yet (denied or still loading): show a helpful state instead of a broken page. */}
      {!center ? (
        <div className="mt-4">
          <EmptyState title="We need a starting point" hint="Share your location, or enter coordinates by clicking 'Use my location'." />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <ListingMap center={center} radiusKm={radiusKm} listings={listings} onPick={setCenter} />
          </div>

          <div className="mt-4">
            {loading && <Loader text="Searching nearby..." />}
            {error && <ErrorMessage message={error} onRetry={load} />}
            {!loading && !error && listings.length === 0 && (
              <EmptyState title="No food available in this area right now"
                hint="Try a larger radius or another place. New listings will appear here." />
            )}

            <div className="grid gap-3">
              {listings.map((listing) => {
                const km = distanceKm(center.lat, center.lng, ...listingLatLng(listing)); // spread: lat, lng
                return (
                  <ListingCard key={listing._id} listing={listing}>
                    <span className="self-center text-sm text-gray-600">{formatDistance(km)} away</span>
                    <button onClick={() => handleClaim(listing)} disabled={claimingId === listing._id}
                      className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-50">
                      {claimingId === listing._id ? 'Claiming...' : 'Claim'}
                    </button>
                  </ListingCard>
                );
              })}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
```

> `...listingLatLng(listing)` *spreads* the `[lat, lng]` array into two separate arguments, so `distanceKm(center.lat, center.lng, lat, lng)` receives four numbers. MDN: [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

**`client/src/pages/MyClaims.jsx`**

```jsx
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { getErrorMessage } from '../utils/errors';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function MyClaims() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/listings/claimed');
      setListings(data.listings);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;
  if (error) return <main className="p-4"><ErrorMessage message={error} onRetry={load} /></main>;

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold">My claims</h1>

      {listings.length === 0 ? (
        <div className="mt-4"><EmptyState title="You haven't claimed anything yet" hint="Find food near you and claim it." /></div>
      ) : (
        <div className="mt-4 grid gap-3">
          {listings.map((listing) => {
            const [lng, lat] = listing.location.coordinates; // stored order: LONGITUDE first
            return (
              <ListingCard key={listing._id} listing={listing}>
                <p className="w-full text-sm">From: {listing.donor?.organization || listing.donor?.name}</p>
                {listing.status === 'claimed' && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="rounded bg-blue-600 px-3 py-1 text-white">
                    Get directions
                  </a>
                )}
              </ListingCard>
            );
          })}
        </div>
      )}
    </main>
  );
}
```

**`App.jsx`**: add the import and route

```jsx
import MyClaims from './pages/MyClaims';
// ...inside <Routes>, next to the /ngo route:
<Route path="/ngo/claims" element={<ProtectedRoute role="ngo"><MyClaims /></ProtectedRoute>} />
```

**Next step after this code:** run it locally. If the map shows grey tiles or one big stacked mess, see "Common mistakes" below before debugging anything else.

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | Log in as an NGO, allow location | Map appears with a blue dot, green circle, pins; list below, nearest first |
| 2 | Deny location | Helpful message; you can still **click the map** to search |
| 3 | Click elsewhere on the map | Centre moves; list refreshes |
| 4 | Change radius 2 km to 50 km | More listings appear; circle size changes |
| 5 | Change the radius rapidly several times | Final list matches the final radius (no flicker back to an old result) |
| 6 | Pin location sanity check | Pins sit where seed data should be (not in the ocean). If not, you have a lat/lng swap |
| 7 | Click **Claim**, confirm | Card disappears; notice shows the pickup address |
| 8 | **My claims** | The listing appears with the address and a working "Get directions" link |
| 9 | **Conflict test:** two browsers, two different NGO accounts, same listing visible. Click **Claim** in both, as close in time as you can | One succeeds; the other sees the "already claimed or expired" message and the card disappears |
| 10 | In Atlas, check that listing | `claimedBy` is the winner's id |
| 11 | As a donor, open the dashboard | The listing shows "Claimed by ..." with a **Mark picked up** button |
| 12 | Stop the server and press Claim | Friendly error, not a frozen button |
| 13 | Phone width | Map and list usable; no sideways scroll |
| 14 | Live site (Vercel) test of 1, 4 and 8 | Works over HTTPS on your phone |

### 🧠 Self-ask questions

1. Why do stored coordinates and Leaflet coordinates have a different order? Where in your code is the swap, and why only in one place?
2. What is a tile server? What does Leaflet do versus react-leaflet?
3. Why does the map need an explicit height?
4. What is a *stale response*? How does `latestRequest` prevent it?
5. The server already sorts by distance. Why do we calculate distance again on the client?
6. Why do we wait for the server before removing a listing after Claim, instead of removing it immediately?
7. A 409 happened. Is that a bug? How should the UI treat it?
8. Why does the "Get directions" link have `rel="noopener noreferrer"`?
9. What privacy trade-off exists with showing the pickup address to every NGO? How would you change it?
10. What would happen with two NGOs and a *non-atomic* claim endpoint? Which Day-4 lab proved it?
11. What does `useMap()` do, and why must `Recenter` be a child of `MapContainer`?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. GeoJSON: [lng, lat]; Leaflet: [lat, lng]. One helper (`listingLatLng`) means one place to get it right.
2. Tile server supplies square map images. Leaflet draws and moves them; react-leaflet gives React components for Leaflet.
3. Without a height, the container collapses to zero.
4. An older request's answer arriving after a newer request's. Only the latest numbered request may update state.
5. The API doesn't return the number. Alternative: `$geoNear` aggregation returns it.
6. The server may say no. Pretending we won would mislead the user.
7. No: an expected outcome of competition. Explain kindly and refresh the list.
8. Prevents the opened page from accessing `window.opener`.
9. Anyone can see where the food is before claiming; show an approximate area until claimed.
10. Both claims could succeed: the Day 4 race test.
11. It returns the map instance; hooks only work inside the map's context.

</details>

### 🤖 Use AI like this

- *"Explain how web map tiles work using a paper-atlas analogy. Then explain why Leaflet and GeoJSON disagree on coordinate order, and the safest way to handle it."*
- *"Here's my `NgoNearby` page. Find a bug where fast radius changes could show wrong results. Explain the cause first; don't just fix it."*
- *"Explain haversine like I'm new to maths. When is it inaccurate? Is it fine for 50 km?"*
- *"List five ways this claim flow could confuse a real NGO volunteer. How would a designer fix each?"*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Map container without height | Nothing visible where the map should be | `className="h-80"` (or inline style) |
| Forgot `import 'leaflet/dist/leaflet.css'` | Tiles scattered/misaligned | It's in `leafletSetup.js`; make sure `ListingMap` imports that file |
| Default marker icon missing (broken-image icon) | Pins invisible | The `leafletSetup.js` fix |
| Passing `[lng, lat]` to Leaflet | Pins in the wrong place | Use `listingLatLng` |
| `react-leaflet` v5 on React 18 | Install or runtime errors | `npm install react-leaflet@4` |
| Calling `useMap()` outside `MapContainer` | Context error | Use it in a **child** component |
| Not disabling the Claim button | Double-click sends two claims | `disabled={claimingId === id}` |
| Treating 409 as a crash | Confusing error screen | Show the message; remove the card |
| Hard-coding the seed city | Empty results in your real city | Edit `CENTER` in `seed.js` and re-seed |
| Testing "two users" in two tabs of one browser | Both tabs are the *same* user (shared `localStorage`) | Use a normal window **plus** incognito, or two browsers |

### Definition of done

- [ ] All 14 test rows pass, including the two-browser conflict test
- [ ] The live site works on your phone
- [ ] You can explain the lng/lat swap and where it lives
- [ ] You can explain why a 409 is an expected outcome
- [ ] Decisions logged

### Git checkpoint

```bash
git add client/package.json client/package-lock.json client/src/leafletSetup.js client/src/utils/geo.js
git commit -m "feat(client): leaflet setup and geo helpers"
git add client/src/components/ListingMap.jsx
git commit -m "feat(client): listing map component"
git add client/src/pages/NgoNearby.jsx client/src/pages/MyClaims.jsx client/src/App.jsx
git commit -m "feat(client): NGO nearby search, claim flow and my claims"
git add docs && git commit -m "docs: record NGO UI trade-offs"
git switch main && git merge feature/ngo-ui && git push
```

### Explain-back

> "The NGO page shares its location, asks the API for available listings within a radius, and shows them on a Leaflet map and in a list. MongoDB stores [longitude, latitude] but Leaflet wants [latitude, longitude], so one helper does the swap. Claiming waits for the server because it can legitimately refuse; a 409 means someone else won, and the UI explains that and removes the listing."

### Resources

- [Leaflet: Quick start](https://leafletjs.com/examples/quick-start/)
- [React Leaflet: Setup and components](https://react-leaflet.js.org/docs/start-introduction/)
- [OpenStreetMap: Tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- [MDN: `rel="noopener"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener)
- [React: Synchronizing with effects (stale results)](https://react.dev/learn/synchronizing-with-effects#fetching-data)

### Tomorrow preview (Day 8)

Everything works, but you must **refresh** to see changes. Tomorrow the server will *push* updates: a donor posts, every NGO's screen updates live, and the donor sees "claimed" without refreshing.

---

## Day 8: Real-Time Updates

### Goal

By the end of today:

- A donor posts food and every NGO's open screen shows it **within a second**, with no refresh.
- When an NGO claims a listing, it disappears from other NGOs' screens, and the **donor** sees a "claimed" notification.
- The Socket.IO connection is **authenticated** and organised into **rooms**.
- Both sides recover correctly after a disconnection.
- You understand polling vs. WebSockets well enough to choose between them.

> **Fallback rule:** if sockets aren't working by early afternoon, switch to **10-second polling** (snippet below), finish the day, and come back to Socket.IO on Day 9's buffer. Polling is a legitimate engineering choice, not a failure.

### Time plan

| Block | Time | What |
|---|---|---|
| Learn | 1.5 h | Real-time options, Socket.IO vocabulary |
| Build 1 | 2 h | Server: HTTP server, socket auth, rooms, emit helpers |
| Build 2 | 2 h | Client: `SocketContext`, live pages |
| Test + deploy | 1 h | Two-window test; live test |
| Reflect | 1.5 h | Comparison table, scaling questions, explain-back |

### Concepts to learn first

1. 🟢 **The problem with plain HTTP.** HTTP is *request, then response*: the server can only speak when spoken to. **Analogy:** you must keep phoning the restaurant to ask "is my order ready?" Real-time needs the opposite: the restaurant **calls you**.
2. 🟢 **Three ways to get live updates.**

   | Approach | How it works | Analogy | Good when |
   |---|---|---|---|
   | **Polling** | Client asks "anything new?" every N seconds | Checking the mailbox every 10 minutes | Few users, updates every few seconds are fine, simplest code |
   | **Server-Sent Events (SSE)** | One long-lived connection; server streams to client (one direction) | A radio broadcast | Server to client only (notifications, dashboards) |
   | **WebSockets / Socket.IO** | One long-lived **two-way** connection | A phone call | Chat, collaboration, anything needing instant two-way traffic |

3. 🟢 **Socket.IO** is a library built on WebSockets. It adds automatic **reconnection**, **rooms**, and a fallback to HTTP long-polling if WebSockets are blocked. (It starts with polling, then upgrades to WebSocket. This is normal.)
4. 🟢 **Events.** You `emit('listing:new', data)` on one side and `on('listing:new', handler)` on the other. **Analogy:** a kitchen bell with named bells.
5. 🟢 **Rooms.** A room is a named group of connections. Instead of "tell everyone," we say "tell the `ngos` room" or "tell `user:123`". **Analogy:** a group chat versus a private message. Our rooms: `ngos` (all NGOs) and `user:<id>` (one person, even across several tabs).
6. 🟢 **Authenticating a socket.** The connection is another door into your server, so it needs the same wristband check. The client sends its JWT during the handshake; a **socket middleware** verifies it before allowing the connection.
7. 🟢 **Emit only after the database write succeeded.** Never announce something that didn't actually happen.
8. 🟡 **Socket.IO has its own CORS setting**, separate from Express's. Forgetting it is the most common reason "the socket works locally but not deployed."
9. 🟡 **Cleanup in `useEffect`.** Every `socket.on` needs a matching `socket.off` when the component goes away, or you'll get duplicate handlers (each event handled twice, thrice...). StrictMode in development *deliberately* exposes missing cleanups.
10. 🟡 **Reconnection can lose events.** If a phone goes through a tunnel, events fired during the gap are gone. After a **reconnect**, re-fetch the truth from the API. Sockets are for *speed*; the API/database remain the *source of truth*.
11. 🟡 **Don't over-share in broadcasts.** All NGOs get "listing changed," but only the donor and the claiming NGO should know **who** claimed. We send other NGOs a version without `claimedBy`.
12. 🔴 **Scaling sockets.** Each connection lives on **one** server process. With two servers, an event emitted on server A never reaches a user connected to server B. The fix is a shared message layer (the Socket.IO **Redis adapter**), plus sticky sessions for the polling transport. We **don't build this** (one server is right at our scale). We only *explain* it.

### Requirements before you start

- [ ] Day 7 merged and working
- [ ] You can run the server and client together
- [ ] Two browser windows available (normal + incognito), each logged in as a different role

### Step-by-step actions

#### A. Server

1. `git switch -c feature/realtime`
2. `cd server && npm install socket.io`
3. Create `sockets/index.js` (init + auth + rooms) and `sockets/emit.js` (helpers).
4. Update `server.js` to wrap Express in a plain HTTP server and attach Socket.IO.
5. Update the controllers: emit after create, claim, complete and cancel (use the **before/after** snippets).
6. Run the server; no errors should appear. Add a temporary `console.log('socket connected', socket.data.user)` in `io.on('connection')` and remove it later.

#### B. Client

7. `cd client && npm install socket.io-client`
8. Create `context/SocketContext.jsx`; wrap `App` with `SocketProvider` inside `AuthProvider` in `main.jsx`.
9. Add the "Live / Offline" badge to the navbar.
10. Update `NgoNearby`, `DonorDashboard`, and `MyClaims` to listen for events (with cleanup and reconnect refetch).
11. **Two-window test** (table below). Open DevTools > Network > **WS** to see the frames.
12. Deploy: add `VITE_SOCKET_URL` on Vercel (Render's origin **without** `/api`), then **redeploy** the client. The server needs no new environment variables.
13. Test live. Remember Render's free tier sleeps: the first connection after idle may take a minute.
14. Write the comparison and scaling notes (Reflect section) into `docs/decisions.md`.

### Key code (server)

**`server/sockets/index.js`**

```js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io; // one Socket.IO server for the whole app, kept here so other files can reach it

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    // Socket.IO has its OWN CORS settings, separate from Express's cors().
    cors: { origin: process.env.CLIENT_URL },
  });

  // SOCKET MIDDLEWARE: runs once per connection attempt. This is `protect` for sockets.
  io.use(async (socket, next) => {
    try {
      // The client sends its token in the handshake: io(url, { auth: { token } })
      const token = socket.handshake.auth?.token;
      const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if missing/invalid/expired

      const user = await User.findById(payload.id).select('role');
      if (!user) return next(new Error('Unauthorized'));

      socket.data.user = { id: user._id.toString(), role: user.role }; // remember who this socket is
      next(); // allow the connection
    } catch {
      next(new Error('Unauthorized')); // reject the connection
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.data.user;

    socket.join(`user:${id}`);              // a private room per user (works across multiple tabs)
    if (role === 'ngo') socket.join('ngos'); // all NGOs share one room
  });

  return io;
}

// Other files call this to get the server. May be undefined in tests (no sockets started).
export function getIO() {
  return io;
}
```

**`server/sockets/emit.js`**

```js
import { getIO } from './index.js';

// Turn a Mongoose document into a plain object (or pass plain objects through).
const toPlain = (listing) => (typeof listing.toObject === 'function' ? listing.toObject() : listing);

// An id can be a plain id OR a populated user object ({ _id, name, ... }). Return the id string either way.
const idOf = (value) => (value ? String(value._id ?? value) : null);

// A new listing: tell every NGO.
export function emitListingNew(listing) {
  getIO()?.to('ngos').emit('listing:new', toPlain(listing)); // "?." = do nothing if sockets aren't running
}

// A listing changed (claimed, completed, cancelled).
export function emitListingUpdated(listing) {
  const io = getIO();
  if (!io) return;

  const plain = toPlain(listing);
  const donorId = idOf(plain.donor);
  const claimerId = idOf(plain.claimedBy);

  // Other NGOs only need to know "this listing changed", NOT who claimed it.
  const { claimedBy, ...publicVersion } = plain;
  let otherNgos = io.to('ngos');
  if (claimerId) otherNgos = otherNgos.except(`user:${claimerId}`); // skip the claimer; they get the full version below
  otherNgos.emit('listing:updated', publicVersion);

  // The donor and the NGO that claimed it get the full version.
  const privateRooms = [`user:${donorId}`];
  if (claimerId) privateRooms.push(`user:${claimerId}`);
  io.to(privateRooms).emit('listing:updated', plain);
}
```

**`server/server.js`** (before and after)

```js
// BEFORE (Day 1):
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// AFTER (today):
import 'dotenv/config';
import http from 'node:http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';

const PORT = process.env.PORT || 5000;

await connectDB();

// Express alone can't speak WebSockets. We wrap it in a plain Node HTTP server,
// attach Socket.IO to that same server, and both share one port.
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**`server/controllers/listing.controller.js`** (changes: before and after)

```js
// ADD at the top:
import { emitListingNew, emitListingUpdated } from '../sockets/emit.js';

// ADD a reusable helper (so claim/complete/cancel all return readable donor + claimer info):
const withParties = (query) =>
  query.populate('donor', 'name organization').populate('claimedBy', 'name organization');
```

```js
// createListing, BEFORE:
//   const listing = await Listing.create({...});
//   res.status(201).json({ listing });
// AFTER:
const listing = await Listing.create({
  ...fields,
  donor: req.user.id,
  location: { type: 'Point', coordinates: [longitude, latitude] },
});
await listing.populate('donor', 'name organization'); // NGOs' screens need the donor's name
emitListingNew(listing);                              // announce AFTER the database write succeeded
res.status(201).json({ listing });
```

```js
// claimListing, BEFORE:
//   const listing = await Listing.findOneAndUpdate(...).populate('donor', 'name organization');
// AFTER:
const listing = await withParties(
  Listing.findOneAndUpdate(
    { _id: id, status: 'available', expiresAt: { $gt: new Date() } },
    { status: 'claimed', claimedBy: req.user.id, claimedAt: new Date() },
    { returnDocument: 'after' }
  )
);
if (!listing) {
  return failTransition(res, { _id: id }, 'This listing was already claimed or has expired');
}
emitListingUpdated(listing); // NEW
res.json({ listing });
```

```js
// completeListing and cancelListing: the same two changes.
//   1) wrap the query:  const listing = await withParties(Listing.findOneAndUpdate(...));
//   2) before res.json: emitListingUpdated(listing);
```

### Key code (client)

**`client/src/context/SocketContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext({ socket: null, connected: false });

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? user?._id; // depending on your API shape; use whichever your user has
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) return; // logged out: no connection

    const token = localStorage.getItem('annaseva_token');
    // Connect, sending the JWT in the handshake so the server can authenticate us.
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });

    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));
    newSocket.on('connect_error', (err) => console.warn('Socket connection problem:', err.message));

    setSocket(newSocket);

    // CLEANUP: runs on logout, on unmount, and in dev's double-run. Closes the connection.
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [userId]);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
```

> **Check your user shape:** the server's `user` JSON has `_id` (Mongoose's default), so `user._id` is the one that exists. The `??` fallback above handles both; keep whichever your code actually uses and delete the other.

**`main.jsx`**: import the provider, then add it *inside* `AuthProvider`

```jsx
import { SocketProvider } from './context/SocketContext.jsx'; // add next to the AuthProvider import

// ...and in the render call:
<AuthProvider>
  <SocketProvider>
    <App />
  </SocketProvider>
</AuthProvider>
```

**`Navbar.jsx`**: the Live badge (add inside the logged-in block)

```jsx
import { useSocket } from '../context/SocketContext';
// inside the component:
const { connected } = useSocket();
// inside the JSX, next to the user's name:
{user && (
  <span title={connected ? 'Live updates on' : 'Reconnecting...'} className="text-xs">
    {connected ? '● Live' : '○ Offline'}
  </span>
)}
```

**`NgoNearby.jsx`**: listen for events (add inside the component, after `load` is defined)

```jsx
import { useSocket } from '../context/SocketContext';
// inside the component:
const { socket } = useSocket();

useEffect(() => {
  if (!socket || !center) return;

  function handleNew(listing) {
    // Only show it if it's inside MY search radius.
    const km = distanceKm(center.lat, center.lng, ...listingLatLng(listing));
    if (km > radiusKm) return;
    setListings((previous) =>
      previous.some((l) => l._id === listing._id) ? previous : [listing, ...previous] // avoid duplicates
    );
    setNotice(`New food nearby: ${listing.title}`);
  }

  function handleUpdated(listing) {
    // Claimed, completed or cancelled means it's no longer available to anyone: remove it.
    if (listing.status !== 'available') {
      setListings((previous) => previous.filter((l) => l._id !== listing._id));
    }
  }

  socket.on('listing:new', handleNew);
  socket.on('listing:updated', handleUpdated);
  // We may have missed events while disconnected, so re-fetch the truth after a reconnect.
  socket.io.on('reconnect', load);

  // CLEANUP: remove exactly the handlers we added, or events will be handled twice.
  return () => {
    socket.off('listing:new', handleNew);
    socket.off('listing:updated', handleUpdated);
    socket.io.off('reconnect', load);
  };
}, [socket, center, radiusKm, load]);
```

**`DonorDashboard.jsx`**: first wrap `load` in `useCallback` (before/after), then listen

```jsx
// BEFORE:  async function load() { ... }
// AFTER:   const load = useCallback(async () => { ...same body... }, []);
// and add `useCallback` to the React import, and change the effect to:  useEffect(() => { load(); }, [load]);

import { useSocket } from '../context/SocketContext';
// inside the component:
const { socket } = useSocket();

useEffect(() => {
  if (!socket) return;

  function handleUpdated(listing) {
    // Swap the changed listing in place. Ignore ones that aren't on this screen.
    setListings((previous) => previous.map((l) => (l._id === listing._id ? listing : l)));
    if (listing.status === 'claimed') {
      setNotice(`${listing.claimedBy?.organization || listing.claimedBy?.name || 'An NGO'} claimed "${listing.title}"`);
    }
  }

  socket.on('listing:updated', handleUpdated);
  socket.io.on('reconnect', load);
  return () => {
    socket.off('listing:updated', handleUpdated);
    socket.io.off('reconnect', load);
  };
}, [socket, load]);
```

**`MyClaims.jsx`**: the same shape, simpler

```jsx
const { socket } = useSocket();
useEffect(() => {
  if (!socket) return;
  const handleUpdated = (listing) =>
    setListings((previous) => previous.map((l) => (l._id === listing._id ? listing : l)));
  socket.on('listing:updated', handleUpdated);
  socket.io.on('reconnect', load);
  return () => {
    socket.off('listing:updated', handleUpdated);
    socket.io.off('reconnect', load);
  };
}, [socket, load]);
```

**Fallback: polling instead of Socket.IO** (use if you're stuck)

```jsx
// Add a "silent" option to load() so polls don't flash the loading spinner:
//   const load = useCallback(async ({ silent = false } = {}) => {
//     if (!silent) setLoading(true);  ...rest unchanged
// Then:
useEffect(() => {
  const timer = setInterval(() => {
    if (document.visibilityState === 'visible') load({ silent: true }); // skip when the tab is hidden
  }, 10000); // every 10 seconds
  return () => clearInterval(timer); // CLEANUP: stop the timer when leaving the page
}, [load]);
```

**Next step after this code:** run the two-window test. Keep the browser's Network > WS tab open and watch frames appear as you post and claim; it makes the abstract idea concrete.

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | Server log with the temporary `console.log` | One line per connected tab, showing role and id |
| 2 | Normal window = NGO on "Find food"; incognito = donor. Donor posts a listing near the NGO's search centre | NGO sees it appear **without refreshing**, with a notice |
| 3 | DevTools > Network > WS on the NGO window | A connection with frames like `42["listing:new",{...}]` |
| 4 | Post a listing **outside** the NGO's radius | NGO screen does **not** change |
| 5 | NGO claims it | Donor sees "... claimed ..." notice and the status changes live |
| 6 | Three windows: donor + two NGOs. NGO A claims | NGO B's list loses that listing instantly |
| 7 | In NGO B's WS frames, find `listing:updated` | Payload has **no** `claimedBy` field (privacy) |
| 8 | Donor clicks **Mark picked up** | NGO A's **My claims** card turns `completed` live |
| 9 | Both NGOs press **Claim** at the same moment | One wins; the other sees the friendly message (Day 7's conflict, now with live updates) |
| 10 | Stop the server while NGO window is open | Badge shows "Offline" |
| 11 | Start the server again | Badge returns to "Live"; list **re-fetches** (post a listing while the NGO was offline to verify it appears) |
| 12 | Log out | WS connection closes (visible in the Network tab) |
| 13 | Navigate between pages 5 times, then post a listing | Event handled **once** (a duplicate notice means a missing cleanup) |
| 14 | Live site (Vercel + Render) | Same as test 2, over HTTPS |

### 🧠 Self-ask questions

1. Why can't a normal HTTP server push data to a browser on its own?
2. Compare polling, SSE and WebSockets. Which would you pick for AnnaSeva, and why? (There's more than one defensible answer.)
3. What is a room? Which rooms does a connected NGO belong to, and which does a donor belong to?
4. Why must a socket connection be authenticated? How does the token get to the server?
5. Why emit **after** the database write, not before?
6. What does `socket.off` in the cleanup prevent? What symptom do you see without it?
7. Why re-fetch after a reconnect instead of trusting events?
8. Why do other NGOs receive a listing without `claimedBy`? What privacy principle is that?
9. If you ran two copies of the server, what would break about real-time? What would still work? (Think: atomic claim vs. socket events.)
10. What is the Redis adapter for, in one sentence?
11. Where does the **source of truth** live: in socket events or in the database/API? Why does that matter?
12. Socket.IO needs its own CORS setting. Why isn't Express's enough?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. HTTP is request/response; the server can only reply to a request.
2. All three work. Polling: simplest. SSE: one-way streaming. Socket.IO: two-way + reconnection + rooms. For a live demo, Socket.IO; for minimal complexity, 10 s polling.
3. A named group of connections. NGO: `user:<id>` and `ngos`. Donor: `user:<id>`.
4. Otherwise anyone could listen to private events. The token is sent in the handshake `auth` and verified by socket middleware.
5. Never announce something that didn't happen.
6. Duplicate handlers: each event handled multiple times.
7. Events during a disconnection are lost. The API is the truth.
8. Data minimisation: share only what each audience needs.
9. Sockets: an event emitted on server A won't reach users on server B. The atomic claim still works (it lives in the database).
10. It lets multiple server instances share events through Redis.
11. Database/API. Events are a speed-up; if one is missed, state must self-correct.
12. Socket.IO handles its own HTTP endpoint, outside Express's middleware.

</details>

### 🤖 Use AI like this

- *"Explain polling, SSE and WebSockets using a phone-call / radio / mailbox analogy. Give me a table comparing cost to the server for 1,000 users."*
- *"My events fire twice after I navigate between pages. Here's my effect: [paste]. Explain what's wrong before giving the fix."*
- *"Explain Socket.IO rooms like WhatsApp groups. What would break if I broadcast `listing:updated` to everyone?"*
- *"Why does Socket.IO need sticky sessions and a Redis adapter when I run two servers? Explain with a diagram in text."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| `app.listen` instead of `httpServer.listen` | Sockets never connect | Listen on the **HTTP server** that Socket.IO is attached to |
| No Socket.IO `cors` option | Works locally, CORS error live | `cors: { origin: process.env.CLIENT_URL }` |
| `VITE_SOCKET_URL` includes `/api` | Connection fails | Origin only: `https://<render>.onrender.com` |
| Forgot to redeploy Vercel after adding the variable | Live socket points to `undefined` | Redeploy |
| Handlers added without cleanup | Events handled 2x, 3x... | Return a cleanup that calls `socket.off` |
| Emitting before the DB write finishes | Clients see things that then fail | Emit after `await` |
| Sending the full listing (with `claimedBy`) to every NGO | Privacy leak | Public version without `claimedBy` |
| Two tabs in one browser as "two users" | Same user in both | Use incognito or another browser |
| Socket not recreated after login | Logged in but "Offline" | `useEffect` depends on the user id |
| Trusting events as truth | Stale lists after a network drop | Re-fetch on `reconnect` |
| Expecting instant connection on Render after idle | 30 to 60 s wait | Free-tier cold start: warm it up before demos |

### Definition of done

- [ ] All 14 test rows pass (or, if you used the polling fallback, a modified set passes and you note why)
- [ ] No duplicate events after page navigation
- [ ] You can explain polling vs. SSE vs. WebSockets without notes
- [ ] You can explain why the Redis adapter would be needed for multiple servers
- [ ] `docs/decisions.md` has "Socket.IO vs polling" (options, choice, trade-off)

### Git checkpoint

```bash
git add server/package.json server/package-lock.json server/sockets server/server.js
git commit -m "feat(realtime): authenticated Socket.IO server with rooms"
git add server/controllers
git commit -m "feat(realtime): emit listing events after database writes"
git add client/package.json client/package-lock.json client/src/context client/src/main.jsx client/src/components/Navbar.jsx
git commit -m "feat(client): socket context and live status badge"
git add client/src/pages
git commit -m "feat(client): live updates on NGO, donor and claims pages"
git add docs && git commit -m "docs: real-time design decisions"
git switch main && git merge feature/realtime && git push
```

### Explain-back

> "Plain HTTP can't push, so I added Socket.IO. Sockets authenticate with the same JWT during the handshake, then join rooms: all NGOs share one, and each user has a private one. After every successful database write the server emits an event: other NGOs get a version without the claimer's identity. If a client disconnects it re-fetches from the API on reconnect, because the database, not the events, is the source of truth. With multiple servers I'd need a Redis adapter, but one server is right for this scale."

### Resources

- [Socket.IO: Tutorial](https://socket.io/docs/v4/tutorial/introduction)
- [Socket.IO: Rooms](https://socket.io/docs/v4/rooms/)
- [Socket.IO: Middlewares and handshake auth](https://socket.io/docs/v4/middlewares/)
- [Socket.IO: Handling CORS](https://socket.io/docs/v4/handling-cors/)
- [Socket.IO: Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/) and [Redis adapter](https://socket.io/docs/v4/redis-adapter/)
- [MDN: Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [React: Synchronizing with effects (cleanup)](https://react.dev/learn/synchronizing-with-effects)

### Tomorrow preview (Day 9)

A working app isn't a safe or polished one. Tomorrow: security headers, rate limiting, a few automated tests, the "meals rescued" counter, accessibility and phone checks, and the buffer for anything unfinished.

---

## Day 9: Hardening, Polish and Buffer

> **Feature freeze starts today.** After this morning's buffer block you add **no new features**. From tonight on, you only fix bugs, write docs and rehearse. Half-finished extra features are the most common way a nearly-finished project ends up broken on demo day.

### Goal

By the end of today:

- Anything unfinished or shaky from Days 1 to 8 is finished (the buffer).
- The API sends security headers, refuses oversized requests, and rate-limits abusive traffic.
- `GET /api/stats` exists and the landing page shows a live "meals rescued" counter.
- `npm test` runs a small automated test suite and it passes.
- The app is usable on a phone-sized screen and with a keyboard alone.
- The **live** site passes a full smoke test.
- You have done a hand security audit and a "what breaks first?" design review on paper.

### Time plan

| Block | Time | What |
|---|---|---|
| **Buffer** | 1.5 h | Finish or fix whatever is unfinished from Days 1 to 8. Do this **first** |
| Security | 1.5 h | helmet, body limit, rate limits, `trust proxy`, hand audit |
| Stats + landing page | 1 h | The endpoint, the counter, a real landing page |
| Tests | 1 h | Validator tests, API tests, one last race test |
| Polish | 1 h | Phone, keyboard, Lighthouse, top-5 bug list |
| Deploy + smoke test | 45 min | Push, wait, test the live site |
| Reflect | 45 min | Design review on paper, decisions, journal |

If Days 1 to 8 went perfectly, the buffer block becomes **extra explain-back time**: say the Day 2, Day 4 and Day 8 explain-backs out loud, to a wall, a friend or a voice recorder.

### Concepts to learn first

1. 🟢 **Never trust the client.** Everything the browser sends can be forged: anyone can open Thunder Client and send any request they like. Hiding a button in React is politeness; the checks on the server are the lock. **Analogy:** a "Staff only" sign on a door is not a lock.
2. 🟢 **Security headers (`helmet`).** Small notes the server attaches to every response, each one telling the browser to switch on a protection (for example, "don't guess file types"). **Analogy:** a stack of safety labels stuck on every parcel you send.
3. 🟢 **Rate limiting.** Counting how many requests one visitor makes in a time window and refusing the extras with `429 Too Many Requests`. **Analogy:** a bouncer who notices you have walked through the door 20 times in 15 minutes. It stops password guessing and runaway loops.
4. 🟡 **Why `trust proxy` matters.** On Render, your request first meets Render's proxy, which forwards it to your server. Without telling Express to trust that, every visitor looks like it has the proxy's address, and the rate limiter counts **all users as one person**.
5. 🟡 **Aggregation = a pivot table.** `$match` filters rows. `$group` squashes many rows into one and lets you `$sum` or count them. It runs inside the database, so you don't download every document to add them up.
6. 🟡 **Automated tests.** A test is a small program that calls your code with known input and checks the answer. A *unit test* checks one function. An *integration test* checks several parts working together. Node has a test runner built in (`node:test`), so there is nothing to install.
7. 🟡 **Accessibility ("a11y").** Can someone use the app with only a keyboard, a screen reader, a small screen, or poor eyesight? Mostly it means using the right HTML (`<button>`, `<label>`, `<main>`), visible focus, and enough colour contrast.
8. 🔴 **Capacity thinking.** Every system has a first thing that breaks. Finding it on paper, before it happens, is the heart of system design.

### Requirements before you start

- [ ] Day 8 is merged and deployed (or your polling fallback works and is deployed)
- [ ] You can register and log in on the **live** site
- [ ] `docs/decisions.md` has entries up to Day 8 (including "Socket.IO vs polling")

### Step-by-step actions

#### A. Buffer first (1.5 h)

1. Open `docs/journal.md`. Under today's date, list everything from Days 1 to 8 that is unfinished, flaky, or that you could not explain. Pick the top three.
2. Fix or finish those three **before** anything else. If you can't fix one in 30 minutes, apply the **cut list** from Section 1 instead of letting it eat the day.
3. Re-read each day's **Definition of done** against the **live** site. Tick it or write the bug in your list.

#### B. Security (1.5 h)

4. `git switch -c feature/hardening`
5. `cd server && npm install helmet express-rate-limit`
6. Create `middleware/rateLimit.js` (code below).
7. Replace `app.js` with the new version (code below). Read the comments: **the order of the lines matters**.
8. Add `authLimiter` to the register and login routes in `routes/auth.routes.js` (code below).
9. Create `scripts/rate-limit-check.js` and run it. Expected: twenty `401`s then `429`s. **Restart the server** afterwards: the counters live in memory, and the test used up your login budget.
10. Walk through the **hand security audit** table (below). Tick every row, or write the problem into your bug list.
11. Run `npm audit`. Read the report. **Do not** run `npm audit fix --force` blindly: it can install breaking upgrades. Fix what is easy, and write down anything you chose to leave.
12. Add the entries to `docs/decisions.md` (list in the Reflect section).

#### C. Stats and a real landing page (1 h)

13. Create `controllers/stats.controller.js` and `routes/stats.routes.js` (code below). `app.js` already mounts them.
14. Test `GET /api/stats` in Thunder Client: `{ "mealsRescued": 0, "pickups": 0 }` on a fresh database.
15. Replace `pages/Landing.jsx` with the real page (code below).
16. Complete one listing end to end (post, claim, **Mark picked up**), then refresh the landing page. The counter should equal the listing's quantity.

#### D. Tests (1 h)

17. Add the `test` script to `server/package.json` (**note the quotes**, explained below).
18. Create `tests/validators.test.js` and `tests/api.test.js` (code below). Run `npm test`.
19. **Break something on purpose:** in `validators/listing.schema.js` change `MAX_HOURS_AHEAD` from `24` to `48`, run `npm test`, and watch the "more than 24 hours away" test fail. Then undo. (Another good one: remove `blankIsMissing` from `latitude` and watch the blank-latitude test fail.) A test you have never seen fail is a test you can't trust yet.
20. Run `node scripts/race-test.js <listingId> <ngoToken>` once more against the final code on a fresh available listing. Expected: one `200`, nineteen `409`.

#### E. Polish (1 h)

21. **Phone check:** DevTools device toolbar (Ctrl/Cmd + Shift + M), widths 360 and 390, then your real phone on the live site. Use the checklist below.
22. **Keyboard-only check:** put the mouse away. Log in, post, and claim using only Tab, Shift+Tab, Enter and Space.
23. **Lighthouse:** DevTools > Lighthouse > Mobile > Accessibility + Best Practices. Fix what it reports (it will almost certainly flag the white-on-green button contrast).
24. Polish the page shell: `client/index.html` (`<title>AnnaSeva</title>`, a description, replace the Vite favicon).
25. Use the app like a stranger for 15 minutes. Write down every annoyance. Fix the **top five**.

#### F. Deploy and smoke test (45 min)

26. Commit in small pieces, merge, push. Wait for Render and Vercel to finish deploying.
27. Run the **trust proxy check** (below) on the live API.
28. Run the **live smoke test** table (below) from two devices.

#### G. Reflect (45 min)

29. Do the paper design review (below) and write `docs/scaling-notes.md`.
30. Update `docs/decisions.md` and `docs/journal.md`. Do the explain-back.

### Key code

**`server/middleware/rateLimit.js`**

```js
import rateLimit from 'express-rate-limit';

// The JSON body sent along with a 429 ("Too Many Requests") response.
// It uses the same { message } shape as every other error, so the React app can show it.
const tooMany = { message: 'Too many requests. Please wait a few minutes and try again.' };

// GENERAL limit for the whole API. Generous: it only exists to stop floods and runaway loops.
// The number can be raised from the environment (handy when a whole room uses one Wi-Fi at a demo).
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                            // the "window": 15 minutes
  limit: Number(process.env.RATE_LIMIT_MAX) || 1000,   // max requests per IP per window
  standardHeaders: true,                               // send RateLimit-* headers so clients can see their budget
  legacyHeaders: false,                                // skip the old X-RateLimit-* headers
  message: tooMany,
});

// STRICT limit for register and login: slows down password guessing.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,                        // only FAILED attempts (status 400 and up) use up the budget
  standardHeaders: true,
  legacyHeaders: false,
  message: tooMany,
});
```

- Older tutorials write `max:` instead of `limit:`. Both work today; `limit` is the current name.
- `skipSuccessfulRequests` means a real user who logs in correctly never gets close to the limit. Only wrong guesses count.
- Counters are stored **in this server's memory**. A restart resets them (useful in development; the reason you'd need Redis with several servers).

**`server/app.js`** (the final shape; compare with Day 2 and Day 3 and note what was added)

```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// On Render the request first reaches Render's proxy, which forwards it to your app.
// Without this line every visitor would appear to have the proxy's IP address, and the
// rate limiter would count ALL users as one person. "1" = trust one proxy hop.
app.set('trust proxy', 1);

app.use(helmet());                                       // 1) safety headers on every response
app.use(cors({ origin: process.env.CLIENT_URL }));       // 2) only our own front end may call us from a browser
app.use(express.json({ limit: '10kb' }));                // 3) parse JSON bodies, and refuse anything bigger than 10 kb

// Health check comes BEFORE the limiter, so uptime monitors never get blocked.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api', apiLimiter);                             // 4) general rate limit for everything below

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/stats', statsRoutes);

// ORDER MATTERS: these two must come AFTER all routes.
app.use(notFound);
app.use(errorHandler);

export default app;
```

- **Order is behaviour.** `helmet()` must run *before* the routes, or the routes' responses go out without the headers.
- The 10 kb limit is plenty for our JSON. A bigger body triggers a `413`, which the Day 2 `errorHandler` turns into a friendly message.

**`server/routes/auth.routes.js`** (add the limiter to the two public routes)

```js
import { authLimiter } from '../middleware/rateLimit.js'; // add with the other imports

// authLimiter goes BEFORE validate and the controller, so blocked requests do no work.
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
```

**`server/scripts/rate-limit-check.js`**

```js
// Sends 25 wrong-password logins in a row and prints the status codes.
// Usage: node scripts/rate-limit-check.js
// Expected: twenty 401s, then 429s. (The failed attempts used up the budget.)
// WARNING: this locks YOUR IP out of login for 15 minutes. In development, restart the server to reset it.
const BASE = process.env.API_URL || 'http://localhost:5000/api';

const codes = [];
for (let attempt = 1; attempt <= 25; attempt++) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@example.com', password: 'wrong-password' }),
  });
  codes.push(res.status);
}
console.log(codes.join(' '));
```

> **Naming trap:** don't name this file `rate-limit-test.js`. Node's test runner treats any file whose name ends in `-test.js` as a test file. (`scripts/race-test.js` from Day 4 has exactly this problem, which is why the test script below lists its files explicitly.)

**`server/controllers/stats.controller.js`**

```js
import Listing from '../models/Listing.js';

// Public "impact" numbers for the landing page. No personal data: only totals.
export async function getStats(req, res) {
  // AGGREGATION PIPELINE: a list of stages; each stage passes its result to the next.
  // Think of a spreadsheet pivot table.
  const [row] = await Listing.aggregate([
    { $match: { status: 'completed' } },       // stage 1: keep only listings that were picked up
    {
      $group: {                                // stage 2: squash all those rows into ONE row
        _id: null,                             //   (null = "one single group")
        mealsRescued: { $sum: '$quantity' },   //   add up the quantity field of every row
        pickups: { $sum: 1 },                  //   add 1 per row = count the rows
      },
    },
  ]);

  // If nothing matched, the pipeline returns an EMPTY array, so `row` is undefined.
  // "?." and "??" turn that into zeros instead of crashing.
  res.json({ mealsRescued: row?.mealsRescued ?? 0, pickups: row?.pickups ?? 0 });
}
```

**`server/routes/stats.routes.js`**

```js
import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';

const router = Router();

// Public on purpose: no protect() here. The numbers are anonymous totals.
router.get('/', getStats);

export default router;
```

**`client/src/pages/Landing.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// A small component that shows the "meals rescued" number.
function ImpactCounter() {
  const [stats, setStats] = useState(null); // null = not loaded yet (or the request failed)

  useEffect(() => {
    let ignore = false; // becomes true if the visitor leaves before the answer arrives
    api
      .get('/stats')
      .then(({ data }) => {
        if (!ignore) setStats(data);
      })
      // This number is decoration. If it fails, show nothing rather than an error banner.
      // (Never do this for something the user needs to know about, such as a failed claim.)
      .catch(() => {});
    return () => {
      ignore = true; // cleanup: don't update state on a page that is gone
    };
  }, []);

  if (!stats) return null;

  return (
    <p className="mt-8 text-lg">
      {/* MDN: Number.prototype.toLocaleString() adds thousands separators */}
      <strong className="text-3xl text-green-700">{stats.mealsRescued.toLocaleString()}</strong> meals rescued
      {stats.pickups > 0 && <> across {stats.pickups.toLocaleString()} pickups</>}
    </p>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'donor' ? '/donor' : '/ngo';

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Surplus food, to the people who need it, before it spoils.</h1>
      <p className="mt-3 text-gray-700">
        AnnaSeva connects restaurants, caterers and hostels with nearby NGOs. Post what is left over, and the first NGO to
        claim it collects it.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {user ? (
          <Link to={dashboardPath} className="rounded bg-green-700 px-4 py-2 text-white">Go to my dashboard</Link>
        ) : (
          <>
            <Link to="/register" className="rounded bg-green-700 px-4 py-2 text-white">Get started</Link>
            <Link to="/login" className="rounded border border-gray-400 px-4 py-2">Log in</Link>
          </>
        )}
      </div>

      <ImpactCounter />

      <h2 className="mt-10 text-xl font-semibold">How it works</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li><strong>Donors post</strong> what is left: what it is, how much, and until when.</li>
        <li><strong>NGOs see it nearby</strong>, on a map and in a list, updated live.</li>
        <li><strong>One NGO claims it.</strong> Nobody else can, and everyone sees that instantly.</li>
        <li><strong>The donor confirms the pickup</strong>, and the meals are added to the total above.</li>
      </ol>
    </main>
  );
}
```

**`server/package.json`** (add one line to `scripts`)

```json
"scripts": {
  "dev": "node --watch server.js",
  "start": "node server.js",
  "test": "node --test \"tests/**/*.test.js\""
}
```

- The quotes around the pattern matter: they stop your terminal from expanding the `*` itself, so Node reads the pattern the same way on Windows, macOS and Linux. The backslashes are just JSON escaping for the inner quotes.
- Plain `node --test` (no pattern) would also run `scripts/race-test.js` as if it were a test, and report it as a failure. And `node --test tests/` (a bare folder) does **not** work on current Node.

**`server/tests/validators.test.js`**

```js
// Run with: npm test
// These tests call the Zod schemas directly. No server and no database are needed,
// so they run in milliseconds and guard the rules most likely to break by accident.
import { describe, it } from 'node:test';      // node:test is built into Node: nothing to install
import assert from 'node:assert/strict';       // strict mode: assert.equal uses === (no sneaky type conversion)
import { registerSchema } from '../validators/auth.schema.js';
import { createListingSchema, nearbySchema } from '../validators/listing.schema.js';

const hoursFromNow = (hours) => new Date(Date.now() + hours * 3600 * 1000).toISOString();

describe('registerSchema', () => {
  const valid = { name: 'Asha', email: 'Asha@Example.com', password: 'longenough1', role: 'donor' };

  it('accepts a valid donor and lowercases the email', () => {
    const result = registerSchema.safeParse(valid); // safeParse returns { success, data | error } and never throws
    assert.equal(result.success, true);
    assert.equal(result.data.email, 'asha@example.com');
  });

  it('rejects the admin role (nobody can self-promote)', () => {
    assert.equal(registerSchema.safeParse({ ...valid, role: 'admin' }).success, false);
  });

  it('rejects a short password', () => {
    assert.equal(registerSchema.safeParse({ ...valid, password: '123' }).success, false);
  });

  it('silently drops unknown fields such as isAdmin', () => {
    const result = registerSchema.safeParse({ ...valid, isAdmin: true });
    assert.equal(result.success, true);
    assert.equal('isAdmin' in result.data, false);
  });
});

describe('createListingSchema', () => {
  // A listing that passes every rule. Each test copies it and breaks exactly ONE thing.
  const valid = () => ({
    title: 'Vegetable biryani',
    foodType: 'veg',
    quantity: 20,
    preparedAt: hoursFromNow(-1),
    expiresAt: hoursFromNow(3),
    pickupAddress: '12 FC Road, Pune',
    latitude: 18.5204,
    longitude: 73.8567,
  });
  const passes = (data) => createListingSchema.safeParse(data).success;

  it('accepts a valid listing', () => assert.equal(passes(valid()), true));
  it('converts numbers sent as text ("20" becomes 20)', () => {
    const result = createListingSchema.safeParse({ ...valid(), quantity: '20', latitude: '18.5', longitude: '73.8' });
    assert.equal(result.success, true);
    assert.equal(result.data.quantity, 20);
  });
  it('rejects an expiry time in the past', () => assert.equal(passes({ ...valid(), expiresAt: hoursFromNow(-2) }), false));
  it('rejects an expiry more than 24 hours away', () => assert.equal(passes({ ...valid(), expiresAt: hoursFromNow(30) }), false));
  it('rejects an expiry before the preparation time', () => {
    assert.equal(passes({ ...valid(), preparedAt: hoursFromNow(2), expiresAt: hoursFromNow(1) }), false);
  });
  it('rejects a latitude outside -90..90', () => assert.equal(passes({ ...valid(), latitude: 91 }), false));
  it('rejects a BLANK latitude (it must not become 0)', () => assert.equal(passes({ ...valid(), latitude: '' }), false));
  it('rejects a blank longitude', () => assert.equal(passes({ ...valid(), longitude: '' }), false));
  it('rejects a quantity of 0', () => assert.equal(passes({ ...valid(), quantity: 0 }), false));
  it('rejects an unknown food type', () => assert.equal(passes({ ...valid(), foodType: 'pizza' }), false));
});

describe('nearbySchema', () => {
  it('defaults the radius to 10 km', () => {
    const result = nearbySchema.safeParse({ lat: '18.52', lng: '73.85' }); // query strings are always text
    assert.equal(result.success, true);
    assert.equal(result.data.radiusKm, 10);
  });
  it('rejects a blank lat or lng', () => {
    assert.equal(nearbySchema.safeParse({ lat: '', lng: '73.85' }).success, false);
    assert.equal(nearbySchema.safeParse({ lat: '18.52', lng: '' }).success, false);
  });
  it('rejects a radius above 50 km', () => {
    assert.equal(nearbySchema.safeParse({ lat: '18.52', lng: '73.85', radiusKm: '500' }).success, false);
  });
});
```

**`server/tests/api.test.js`**

```js
// Run with: npm test
// Starts the real Express app on a random free port and sends it real HTTP requests.
// None of these requests touch the database, so no MongoDB is needed.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../app.js'; // possible only because app.js does NOT call listen() (that lives in server.js)

describe('API (no database needed)', () => {
  let server;
  let base; // e.g. http://localhost:51234

  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve)); // port 0 = "pick any free port"
    base = `http://localhost:${server.address().port}`;
  });

  after(() => server.close()); // always shut the server down, or the test run never ends

  it('GET /api/health answers 200 with status "ok"', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).status, 'ok');
  });

  it('sends security headers (helmet)', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  });

  it('answers an unknown route with a JSON 404', async () => {
    const res = await fetch(`${base}/api/nope`);
    assert.equal(res.status, 404);
    assert.match((await res.json()).message, /not found/i);
  });

  it('answers malformed JSON with 400, not 500', async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ this is not json',
    });
    assert.equal(res.status, 400);
  });

  it('rejects a protected route without a token (401)', async () => {
    const res = await fetch(`${base}/api/listings/mine`);
    assert.equal(res.status, 401);
  });

  it('rejects an oversized body (413)', async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.co', password: 'x'.repeat(20000) }),
    });
    assert.equal(res.status, 413);
  });
});
```

**Next step after this code:** run `npm test`. You should see 23 passing tests. Then do the "break it on purpose" step (action 19) so you've seen a red test.

### The hand security audit

Go through every row on the **live** site. A row you can't tick is a bug to fix or a risk to write down in `docs/decisions.md`.

| # | Check | How to verify | Why it matters |
|---|---|---|---|
| 1 | `.env` is not in Git | `git log --all --oneline -- server/.env` prints nothing. Search your GitHub repo for `MONGO_URI` | Leaked secrets are scraped by bots within minutes |
| 2 | Production `JWT_SECRET` is long, random, and **different** from dev | Look at Render's environment tab | Anyone who knows the secret can forge login tokens |
| 3 | Passwords are hashed and never returned | Register; the response has no `password` field; look at the user in Atlas | A database leak shouldn't leak passwords |
| 4 | Nobody can self-promote | Register with `role: "admin"` gets `400` | Privilege escalation |
| 5 | Ownership is enforced | Donor B tries to cancel or complete Donor A's listing: `404` | **Broken access control** is the #1 web vulnerability on OWASP's list |
| 6 | Roles are enforced | An NGO token on `POST /api/listings` gets `403`; a donor on `claim` gets `403` | Hiding buttons is not security |
| 7 | Everything sensitive needs a token | `GET /api/listings/mine` without a header gets `401` | |
| 8 | Input is validated on the server | Send a bad payload straight from Thunder Client, bypassing the form | The form is just a suggestion |
| 9 | Errors don't leak internals | Cause a server error; the response is the generic 500 message with no stack trace | Stack traces teach attackers about your code |
| 10 | CORS is limited to your front end | `CLIENT_URL` on Render is your exact Vercel URL | |
| 11 | The database user has least privilege | In Atlas > Database Access, edit the user: give it read/write on **only** your `annaseva` database, not "any database" or admin | If the password leaks, the damage is limited to one database |
| 12 | Dependencies reviewed | `npm audit` in `server/` and `client/`; read it | Known-vulnerable packages |
| 13 | No demo accounts in production | Day 10 shows how to seed production safely, and remove the demo users afterwards | A published password is a public door |
| 14 | `x-powered-by` header is gone | `curl -I <api-url>/api/health` | helmet removes it; it advertises your framework to attackers |

> 🟡 **A known trade-off you should be able to explain:** we keep the login token in `localStorage`. That is simple, but any script that runs on your page (an XSS attack) could read it. The alternative is an `httpOnly` cookie that scripts cannot read, which brings its own work (CSRF protection, cookie settings across two domains). React escapes text by default, which is the main defence; **never** use `dangerouslySetInnerHTML` with user-provided text. Write this into `docs/decisions.md`.

### Check `trust proxy` on Render (do this once)

`trust proxy` is a number that depends on how many proxies sit in front of your app. `1` is the usual value on Render, but **don't assume: check.**

1. Temporarily change the health route in `app.js`:
   ```js
   app.get('/api/health', (req, res) => {
     console.log('client ip seen by Express:', req.ip); // TEMPORARY: remove after the check
     res.status(200).json({ status: 'ok', time: new Date().toISOString() });
   });
   ```
2. Deploy, then open `https://<your-render-url>/api/health` from your laptop.
3. Open Render > your service > **Logs**. Compare the logged IP with your real public IP (search the web for "what is my IP").
4. **Same IP:** the setting is right. **A different address** (private, or the same for every device you try): try `app.set('trust proxy', 2)` and repeat.
5. **Remove the `console.log`**, deploy again.

### The live smoke test

Run from **two devices**: a laptop on Wi-Fi, and a phone on mobile data (so you are really testing the internet, not your home network).

| # | Check | Expected |
|---|---|---|
| 1 | Open the live URL in a fresh incognito window (allow ~1 minute if Render was asleep) | Landing page loads; the counter appears (or is hidden if the API is still waking) |
| 2 | Register a donor on the laptop and an NGO on the phone | Both succeed and land on their dashboards |
| 3 | Donor posts a listing near the NGO's location | NGO phone shows it **live**, without refresh |
| 4 | NGO claims it | Donor's laptop shows "claimed" live; NGO sees the pickup address |
| 5 | Donor clicks **Mark picked up**, then reload the landing page | Counter increased by the listing's quantity |
| 6 | Open `/donor` directly in a new tab, then hit refresh | No 404 (the `vercel.json` rewrite works) |
| 7 | Log in with a wrong password a few times | Friendly error, not a crash |
| 8 | DevTools > Network > click an API response | `RateLimit-*` headers are present |
| 9 | `curl -I <api-url>/api/health` | `x-content-type-options: nosniff`, **no** `x-powered-by` |
| 10 | Render > Logs during all of the above | No unexpected errors, no stack traces |

**Do not** run `rate-limit-check.js` against the live site: you would lock your own IP out of login for 15 minutes.

### Polish checklists

**Phone check (360 px and 390 px wide, then a real phone)**

| Check | Pass when |
|---|---|
| No sideways scrolling on any page | The page never wobbles left and right |
| Navbar | Links wrap or collapse instead of overflowing |
| Map | It has an **explicit height** (for example `h-72 sm:h-96`); a Leaflet map with no height is invisible |
| Buttons and links | About 44 px tall: easy to hit with a thumb |
| Form inputs | Text at least 16 px (`text-base`). Smaller input text makes iPhones zoom in when you tap |
| Date-time inputs | Usable with the phone's own picker |
| Tailwind habit | Write the **phone** layout first; add `sm:` / `md:` classes for bigger screens (Tailwind is mobile-first) |

**Keyboard-only check**

| Check | Pass when |
|---|---|
| Tab reaches every link, button and field, in a sensible order | Yes |
| You can **see** where focus is | A clear outline on every focused element |
| Enter submits forms; Space or Enter presses buttons | Yes |
| Nothing important is clickable but unreachable (a `<div onClick>`) | Use real `<button>` and `<a>` |

If focus is invisible, add this once to `client/src/index.css`:

```css
/* Visible keyboard focus everywhere. Never remove an outline without replacing it. */
:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}
```

**Accessibility basics**

| Check | Pass when |
|---|---|
| Every input has a visible `<label>` | Placeholder text is **not** a label |
| Colour contrast | Text meets about 4.5:1. The white-on-`green-600` buttons from Days 6 and 7 are close to 3.3:1 and fail: replace `bg-green-600` with `bg-green-700` (about 5:1). Confirm with Lighthouse or WebAIM's contrast checker |
| Status is not shown by colour alone | The `StatusBadge` shows text ("claimed"), not just a colour |
| Messages are announced | Errors use `role="alert"`; success notices use `role="status"` |
| The map has a non-map twin | Everything on the map is also in the list, which keyboard and screen-reader users can use |
| Page basics | `lang="en"` on `<html>`, a real `<title>`, one `<h1>` per page, a `<main>` landmark |

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | `npm test` in `server/` | 23 passing, 0 failing |
| 2 | Break a rule on purpose, run `npm test` | A test fails with a readable message; undo and it passes again |
| 3 | `node scripts/rate-limit-check.js` (local) | Twenty `401`s, then `429`s |
| 4 | After the `429`s, response body | `{ "message": "Too many requests. ..." }` and the React login form shows it |
| 5 | Restart the server, log in correctly | Works again (counters reset) |
| 6 | Send a 20 kb JSON body | `413` with "Request body too large" |
| 7 | Send `{ not json` | `400`, not `500` |
| 8 | `GET /api/stats` on an empty database | `{ "mealsRescued": 0, "pickups": 0 }` |
| 9 | Complete a 20-meal listing | `mealsRescued` becomes 20 |
| 10 | Landing page with the API turned off | Page still renders; counter is simply hidden |
| 11 | Lighthouse accessibility score (mobile) | 90 or higher, or a written list of what remains |
| 12 | Keyboard-only: log in, post a listing, claim one | Possible without the mouse |
| 13 | Live smoke test table | All ten rows pass |
| 14 | `trust proxy` check | Logged IP matches your real IP |

### 🧠 Self-ask questions

1. Why is hiding the "Post food" button from NGOs **not** a security measure? What actually stops an NGO from posting?
2. What does `helmet` do, in one sentence? Name one header it adds.
3. What attack does rate limiting slow down? Why is the login limit much stricter than the general limit?
4. What does `skipSuccessfulRequests: true` do? What is a downside when 50 people share one Wi-Fi network at an event?
5. If you ran **two** copies of the server, what would happen to the rate-limit counters? Where would you keep them instead?
6. What does `trust proxy` change? What exactly goes wrong on Render without it?
7. Why is keeping the JWT in `localStorage` a trade-off? What attack is it exposed to, and what is the alternative?
8. What is the difference between a unit test and an integration test? Which kinds did you write today?
9. Why does `app.js` being separate from `server.js` make `api.test.js` possible?
10. Explain the `/api/stats` pipeline to a friend using a pivot-table analogy. Why does an empty result need `?.` and `??`?
11. A `.catch(() => {})` is acceptable on the impact counter. Why would it be a **bug** on the Claim button?
12. Which of today's tests would have caught the "blank latitude silently becomes 0" bug?
13. Name three problems the keyboard-only test can reveal.
14. If traffic grew 100 times tomorrow, what breaks first? (Answer in `docs/scaling-notes.md`, below.)

<details>
<summary>Hints (check after you've written your answers)</summary>

1. Anyone can send requests without your React app. The server's `restrictTo('donor')` check is what blocks them (a `403`).
2. It sets safety-related HTTP headers. For example `X-Content-Type-Options: nosniff` (the browser must not guess file types) or removing `X-Powered-By`.
3. Brute-force password guessing and accidental floods. Login is the one place an attacker can try thousands of guesses, so it gets a small budget.
4. Only failed attempts count. At an event, failed attempts from many people behind the same address add up; raise the limit or use `RATE_LIMIT_MAX` for general traffic.
5. Each server keeps its own counts, so a user could get double the budget. Use a shared store such as Redis.
6. Express reads the real visitor address from the `X-Forwarded-For` header the proxy added. Without it, `req.ip` is the proxy's address, so everyone shares one counter and the 20-attempt limit hits all users together.
7. Scripts running on the page can read `localStorage`, so an XSS bug could steal tokens. `httpOnly` cookies can't be read by scripts but need CSRF protection and careful cross-domain settings.
8. Unit: one function (validators). Integration: several parts together (Express app + middleware over real HTTP).
9. The test can import the app and start it on a random port, without `server.js` connecting to the database or taking port 5000.
10. `$match` = filter rows; `$group` = combine rows and sum. With no completed listings the result is an empty array, so the first row is `undefined`.
11. A failed claim is something the user must know about. Swallowing the error would show nothing and leave them thinking they got the food.
12. The `rejects a BLANK latitude` test.
13. Invisible focus, unreachable controls (a `div` instead of a `button`), a wrong tab order, a form that can't be submitted with Enter.
14. Likely the free database's throttling (about 100 operations per second) and the single Node process; see the scaling table below.

</details>

### Paper design review (45 minutes, no code)

Create `docs/scaling-notes.md` and answer each question in two or three sentences. The point is the **reasoning**, not a perfect answer.

| Question | A good answer mentions |
|---|---|
| What breaks first at 100x traffic? | The free database's ~100 ops/second throttle, then the single Node process on Render's free instance |
| What happens to rate-limit counters with two servers? | Each server counts separately; a shared store (Redis) is needed |
| What happens to Socket.IO with two servers? | Events only reach clients connected to the *same* server; Redis adapter plus sticky sessions |
| Which endpoint could use a cache? | `/api/stats` (same answer for everyone). Trade-off: numbers up to N seconds old |
| Which query is hardest to cache? | `/nearby` (every user's location differs) |
| What is a single point of failure here? | One Render instance, one Atlas cluster with no uptime guarantee on the free tier |
| What would you monitor in production? | Uptime of `/api/health`, error rate, number of `429`s, database latency |
| What's the next scaling step you'd actually take? | Indexes first, then caching hot reads, then more servers with Redis, in that order |

**Add to `docs/decisions.md`** (three lines each: options, choice, trade-off):

- helmet + rate limiting: why both, why the login limit is stricter, why counters in memory are fine at this size
- JWT in `localStorage` vs `httpOnly` cookie
- `trust proxy = 1` and how you verified it
- `/api/stats` computed live vs cached

### 🔴 Optional deep dives (skip if you're behind)

**1. Cache the stats endpoint (shows what caching really costs).**

```js
// In stats.controller.js: remember the last answer for 30 seconds.
let cached = null;            // the saved answer
let cachedUntil = 0;          // when it stops being valid (a timestamp in milliseconds)

export async function getStats(req, res) {
  if (cached && Date.now() < cachedUntil) return res.json(cached); // fast path: no database work
  // ...run the aggregation exactly as before, producing `result`...
  cached = result;
  cachedUntil = Date.now() + 30 * 1000;
  res.json(result);
}
```

Observe the trade-off: the counter can now be up to 30 seconds behind, and with two servers each keeps its own cache. For a live demo you'd probably leave it **off**; being able to explain that choice is the point.

**2. A tiny load test, on your own laptop only.** Never aim this at the free-tier live site.

```bash
# In server/.env set RATE_LIMIT_MAX=1000000 first, or you will just see 429s. Restart the server.
npx autocannon -c 20 -d 10 http://localhost:5000/api/health   # no database involved
npx autocannon -c 20 -d 10 http://localhost:5000/api/stats    # one aggregation per request
```

Compare requests per second. Which is slower, and why? Remember your dev database is on Atlas's free tier, which throttles at about 100 operations per second.

### 🤖 Use AI like this

- *"Explain rate limiting using a nightclub bouncer analogy. Then show the smallest `express-rate-limit` setup and tell me what each option does."*
- *"Here's my `app.js` middleware order: [paste]. Is anything in the wrong order? Explain the consequence of each mistake before suggesting a fix."*
- *"Review `/api/stats` and `Landing.jsx` like a senior engineer. Don't rewrite them; list issues and explain why each matters."*
- *"I'll describe how I'd test the claim endpoint. Tell me what is a unit test and what is an integration test, and what I should NOT test."*
- *"Quiz me on web security basics (broken access control, XSS, brute force) using only AnnaSeva examples."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Missing `app.set('trust proxy', 1)` on Render | Every user shares one rate-limit counter; after ~20 failed logins from anyone, **everyone** is blocked | Set it, and verify with the IP check |
| `helmet()` placed after the routes | Responses have no security headers | Put it near the top |
| Health route placed after the limiter | Uptime monitors get `429` | Register `/api/health` before `apiLimiter` |
| Rate limit too low for an event | A room full of people on one Wi-Fi gets blocked | Raise `RATE_LIMIT_MAX`; remember counts are per IP |
| Running the rate-limit script against production | You lock yourself out for 15 minutes | Test locally only |
| `node --test` with no pattern | `scripts/race-test.js` is run as a test and "fails" | Use the quoted glob in the npm script |
| `node --test tests/` | `Cannot find module '.../tests'` | Use `"tests/**/*.test.js"` |
| Unquoted glob in the npm script | Works on macOS, breaks on Windows | Keep the quotes |
| `npm audit fix --force` | Surprise major-version upgrades break the app | Read the report; fix selectively; re-test |
| Tests that need a real database and the internet | Slow, flaky, fail in CI | Keep unit tests pure; integration-test only what you must |
| White text on `green-600` | Lighthouse contrast failure | Use `green-700` or darker |
| Placeholder text instead of `<label>` | Screen readers announce nothing useful | Add labels |
| Adding features today | Demo-day regressions | Feature freeze: bug fixes only |
| Demo accounts left in production | Anyone can log in with the published password | Day 10 seeds and removes them safely |

### Definition of done

- [ ] The unfinished items from your buffer list are finished, or consciously cut using the cut list
- [ ] `helmet`, the 10 kb body limit, `apiLimiter` and `authLimiter` are live
- [ ] `trust proxy` is verified against your real IP, and the temporary log line is removed
- [ ] `npm test` passes (23 tests); you have seen a test fail on purpose
- [ ] `/api/stats` works and the landing page shows the counter (and survives the API being down)
- [ ] Phone, keyboard and Lighthouse checks done; top-five polish bugs fixed
- [ ] Hand security audit complete; every unticked row is written down in `docs/decisions.md`
- [ ] Live smoke test: all ten rows pass
- [ ] `docs/scaling-notes.md` written
- [ ] You can explain rate limiting, `trust proxy` and the stats pipeline without notes

### Git checkpoint

```bash
git add server/package.json server/package-lock.json server/middleware/rateLimit.js
git commit -m "feat(security): rate limiting middleware"
git add server/app.js server/routes/auth.routes.js
git commit -m "feat(security): helmet, body size limit, trust proxy and limiters"
git add server/controllers/stats.controller.js server/routes/stats.routes.js
git commit -m "feat(stats): public meals-rescued endpoint"
git add server/tests server/scripts/rate-limit-check.js
git commit -m "test: validator and API tests, rate limit check script"
git add client/src client/index.html
git commit -m "feat(client): real landing page with impact counter; accessibility and mobile fixes"
git add docs && git commit -m "docs: security audit, scaling notes, decisions"
git switch main && git merge feature/hardening && git push
```

### Explain-back

> "I treat the browser as untrusted, so every rule is enforced on the server: validation, roles, and ownership checks. On top of that I added helmet for safe headers, a 10 kb body limit, and rate limiting, with a stricter limit on failed logins to slow password guessing. On Render I had to set `trust proxy`, otherwise every visitor looks like the same IP; I checked it against my real IP. The landing counter comes from a MongoDB aggregation that sums quantities of completed listings. I wrote tests for the validation rules and for the API's error handling, and I tested the app on a phone and with a keyboard. I know the limits: in-memory rate-limit counters and Socket.IO would both need Redis with more than one server."

### Resources

- [helmet](https://helmetjs.github.io/)
- [express-rate-limit documentation](https://github.com/express-rate-limit/express-rate-limit)
- [MDN: HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [MDN: HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) (read A01 Broken Access Control first)
- [Node.js test runner](https://nodejs.org/api/test.html)
- [MongoDB aggregation pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [web.dev: Learn Accessibility](https://web.dev/learn/accessibility)
- [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)
- [Chrome Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)

### Tomorrow preview (Day 10)

Tomorrow is about **telling the story**: a README that sells the project, production demo data that is seeded safely, a two-minute demo video, your pitch, and a mock interview built from your own decisions and trade-offs.

---

## Day 10: Docs, Demo and Interview Prep

> **Today you turn a working project into a story people can follow.** Code that nobody can find, run or understand does not get you interviews. A clear README, a short demo video and a rehearsed explanation do.

### Goal

By the end of today:

- The repo is clean, and a **stranger can run it** by following your README alone.
- The README has a live link, screenshots, an architecture diagram, setup steps, and a "decisions and trade-offs" section.
- Production has **safe** demo data, and you know how to remove it.
- A 2-minute demo video exists and is linked from the README.
- You can give a 30-second, 2-minute and 5-minute version of the project story.
- You have practised a mock interview and written a one-page interview cheat sheet.
- The project is tagged `v1.0.0`.

### Time plan

| Block | Time | What |
|---|---|---|
| Repo clean-up | 45 min | Remove dead code, check env files, run build and tests |
| README | 1.5 h | Write it, add screenshots, then do the **fresh-clone test** |
| Production demo data | 1 h | Seed safely, rehearse, learn how to clean up |
| Demo video | 1 h | Script, record, upload, link |
| Presentation | 30 min | GitHub "About", resume bullets, LinkedIn post |
| Mock interview | 1.5 h | Answer questions out loud, record yourself, get AI feedback |
| Retrospective | 45 min | What you learned, what's next |

### Concepts to learn first

1. 🟢 **A README is the front door.** A recruiter or interviewer gives your repo one to two minutes. They want: what is it, can I see it working, what tech is used, and does this person think clearly. **Analogy:** the menu board outside a restaurant. Great food behind a blank door goes unvisited.
2. 🟢 **Show, don't tell.** A screenshot, GIF or video beats a paragraph. A live link beats all three (with a warning that the free server takes about a minute to wake up).
3. 🟢 **A project story has five beats.** Problem, solution, one hard problem you solved, one trade-off you made, what you'd do next. You prepared all five over ten days.
4. 🟡 **Production data hygiene.** Your dev database is a sandbox; production is what strangers see. Demo accounts with a published password are a public door, so use a strong private password and **remove the accounts after the demo**.
5. 🟡 **A demo is engineered, not improvised.** Pre-load the data, warm the server, open the tabs, have a backup recording, and decide in advance what you'll say if something breaks.
6. 🟡 **Answer shape for interviews.** *Direct answer, then the why, then the trade-off, then what you'd change.* "I don't know, but here is how I would find out" is a strong answer; a bluff is not.

### Requirements before you start

- [ ] Day 9 is merged and deployed; the live smoke test passed
- [ ] You respected the feature freeze (no new features since yesterday morning)
- [ ] `docs/decisions.md`, `docs/scaling-notes.md` and `docs/journal.md` exist and have real content

### Step-by-step actions

#### A. Repo clean-up (45 min)

1. `git switch -c docs/final`
2. Search for leftovers: `console.log` you added for debugging, commented-out code, `TODO` comments, unused files (`grep -rn "console.log" server client/src` or VS Code's search). Keep only logs that are genuinely useful on a server (for example "Server running").
3. Make `server/.env.example` and `client/.env.example` complete. **Every** variable your code reads must be listed, with a fake value. (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, optional `RATE_LIMIT_MAX` on the server; `VITE_API_URL`, `VITE_SOCKET_URL` on the client.)
4. Check what Git tracks: `git ls-files | grep -i env` should print **only** the two `.env.example` files.
5. In `client/`: `npm run build` must finish without errors. In `server/`: `npm test` must pass.
6. Make sure `package.json` has a useful `"name"` and `"description"`, and `"engines": { "node": ">=22" }` in `server/package.json` (it tells hosts which Node to use).
7. Optionally add a `LICENSE` file (MIT is the common choice for portfolio projects).

#### B. The README (1.5 h)

8. Take screenshots **first** (at least four): landing page, donor dashboard, NGO map with pins, "claimed" state. Use a desktop width and one phone width. Save them in `docs/images/` with clear names (`ngo-map.png`).
9. Copy the template from **Appendix B** into `README.md` and fill every section in your own words. Don't leave template placeholders behind.
10. Add the architecture diagram (a Mermaid diagram is in the template; GitHub draws it automatically).
11. Write the **"Decisions and trade-offs"** section from your `docs/decisions.md`: pick the best five.
12. **Fresh-clone test (do not skip):** clone your repo into a *new, empty folder*, follow **only** your README to run it locally. Every place you had to guess, or got an error, is a bug in the README. Fix it and repeat until it works untouched.

#### C. Production demo data, safely (1 h)

Your seed script was built for the dev database. Production needs more care.

13. Create a file `server/.env.production` containing **only** the production `MONGO_URI`. It is ignored by Git because of the `.env.*` rule. Check with `git status` that it does not appear.
14. Seed with a **strong, private** demo password and the `--force` flag (the script refuses non-dev databases without it):
    ```bash
    # In server/. --env-file loads the production URI before the script runs.
    DEMO_PASSWORD="a-long-private-passphrase" node --env-file=.env.production scripts/seed.js 12 --force
    ```
    On Windows PowerShell:
    ```powershell
    $env:DEMO_PASSWORD = "a-long-private-passphrase"
    node --env-file=.env.production scripts/seed.js 12 --force
    ```
    Read the first line the script prints: **`Connected to database: annaseva`**. If it says `annaseva_dev`, the wrong URI loaded; stop.
15. Open the live site, log in as `ngo.demo@example.com` with that password, and confirm listings appear on the map.
16. **Remember the clock.** Seeded listings expire **1 to 6 hours** after seeding, so last night's data is gone by morning. Seed again **30 minutes before** any demo, then rehearse once.
17. **Learn the cleanup**, and run it when the demo is over:
    ```bash
    node --env-file=.env.production scripts/cleanup-demo.js --force
    ```
    It removes the two demo accounts and every listing they posted or claimed.
18. Better still for the very long term: don't leave demo accounts on a public site at all. Register your own donor and NGO accounts through the UI with strong passwords, and use those for demos.

#### D. The demo video (1 h)

19. Write a script using the template in **Appendix D**. Target **two minutes**. Rehearse twice without recording.
20. Set up: two browser windows side by side (donor and NGO), the server warmed up, seeded data fresh, notifications off, browser zoom at 125% so text is readable, unrelated tabs closed.
21. Record (OBS Studio is free; your phone's screen recorder works too). Speak slowly. Do a second take if you stumble.
22. Upload it (an unlisted YouTube video or a Loom link is fine) and add the link near the top of the README. Keep a copy of the file on your laptop as a backup.

#### E. Presentation (30 min)

23. **GitHub repo "About" box:** a one-line description, the live URL, and topics: `mern`, `react`, `nodejs`, `express`, `mongodb`, `socket-io`, `leaflet`, `tailwindcss`, `jwt`. Pin the repo on your profile.
24. Write 3 **resume bullets** and one **LinkedIn post** from the templates below. Use only numbers that are true.
25. Create a release: `git tag -a v1.0.0 -m "AnnaSeva v1.0.0" && git push --tags`.

#### F. Mock interview (1.5 h)

26. Create `docs/interview-notes.md` from the template below. Fill it **from memory first**, then check against your code and docs.
27. Pick 12 questions from **Appendix C** (at least two from each section). Answer each **out loud**, two minutes maximum, and **record yourself**.
28. Listen back. Count the "um"s, the vague answers ("it just handles it"), and the places where you looked at the code. Those are your study list.
29. Run an AI mock interview using the prompt below, then ask it to grade your answers.

#### G. Retrospective (45 min)

30. In `docs/journal.md`, answer: What was hardest? What surprised me? Which concept can I now explain well? Which one am I still shaky on? What would I do differently if I started again?
31. Choose your **next step** from Appendix E, or start your next project. Then take a day off.

### Key code and templates

**`server/scripts/cleanup-demo.js`**

```js
// Removes the demo accounts and everything they own or claimed.
// Usage: node scripts/cleanup-demo.js [--force]
// Run it after a demo on any database other than your *_dev one (--force is required there).
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

const DEMO_EMAILS = ['donor.demo@example.com', 'ngo.demo@example.com'];
const FORCE = process.argv.includes('--force');

await mongoose.connect(process.env.MONGO_URI);
const dbName = mongoose.connection.name;
console.log(`Connected to database: ${dbName}`);

// Same safety net as seed.js: make the person confirm they mean a non-dev database.
if (!dbName.endsWith('_dev') && !FORCE) {
  console.error('This is not a *_dev database. Re-run with --force if you really mean it.');
  process.exit(1);
}

// Find the demo users first, so we know which listings belong to them.
const demoUsers = await User.find({ email: { $in: DEMO_EMAILS } }).select('_id');
const demoIds = demoUsers.map((user) => user._id);

// Delete listings they posted OR claimed, then the users themselves.
const listings = await Listing.deleteMany({ $or: [{ donor: { $in: demoIds } }, { claimedBy: { $in: demoIds } }] });
const users = await User.deleteMany({ _id: { $in: demoIds } });

console.log(`Deleted ${listings.deletedCount} listings and ${users.deletedCount} demo users.`);
await mongoose.disconnect();
```

- `--env-file=.env.production` is built into current Node. Variables loaded this way **win** over the `.env` file that `dotenv` loads inside the script, so the script talks to production, not dev.
- Both seed and cleanup refuse to run on a database whose name doesn't end in `_dev` unless you pass `--force`. That small friction has saved many people from wiping the wrong database.

**`docs/interview-notes.md`** (your one-page cheat sheet)

```markdown
# AnnaSeva: interview notes

## 30-second pitch
(Problem, solution, who uses it, one standout feature.)

## Architecture in five sentences
1. ...

## Five hard problems I solved (problem -> what I tried -> what worked -> what I learned)
1. Double-claim race condition: ...
2. Longitude/latitude order: ...
3. CORS and environment variables between Vercel and Render: ...
4. Duplicate socket events after navigating: ...
5. (a bug of my own)

## Five trade-offs I can defend
1. Socket.IO vs polling: ...
2. JWT in localStorage vs httpOnly cookie: ...
3. Expiry computed in queries vs stored with a cron job: ...
4. Reference donor by id vs embed it: ...
5. In-memory rate limiting vs Redis: ...

## Five things I'd change with more time
1. ...

## Numbers I can quote honestly
- Roles: 2. Endpoints: ... Tests: 23. Estimated demo traffic: about one request per 9 seconds.

## Questions I would ask the interviewer
1. How does your team review code and ship changes?
```

**Resume bullets** (replace the brackets; keep only what is true)

```text
- Built and deployed AnnaSeva, a full-stack MERN app where donors post surplus food and nearby NGOs claim it, with
  role-based access, JWT authentication, and live updates via Socket.IO. [live link]
- Prevented double-booking with a single atomic MongoDB update (verified with a 20-request concurrency test), and used a
  2dsphere geospatial index for "within N km" searches on an interactive Leaflet map.
- Added input validation (Zod), rate limiting, security headers and 23 automated tests; deployed on Vercel, Render and
  MongoDB Atlas, and documented the design decisions and trade-offs.
```

**LinkedIn post template**

```text
I just finished a 10-day build of AnnaSeva: a web app that connects restaurants with leftover food to nearby NGOs.

What it does: donors post surplus food; NGOs see it on a live map and claim it; only one NGO can win, even if two click
at the same moment.

What I learned: [one real lesson, e.g. why the claim has to be a single atomic database operation].

Stack: React, Node/Express, MongoDB, Socket.IO, Leaflet. Live demo and code in the first comment. I'd love feedback.
```

**Talking honestly about AI assistance** (interviewers ask, especially for AI-focused roles)

> "I used AI as a tutor and pair programmer. I asked it to explain concepts before showing code, and I didn't keep code I couldn't explain. It was also wrong sometimes: it suggested patterns from older library versions, so I learned to check the installed version and the official docs. For example, [your own real example]. Every part of this project I can walk through line by line."

### Test it

| # | Check | Expected |
|---|---|---|
| 1 | `git ls-files \| grep -i env` | Only the two `.env.example` files |
| 2 | `npm run build` (client) and `npm test` (server) | Both succeed |
| 3 | **Fresh-clone test** following only the README | App runs locally with no guessing |
| 4 | Click every link in the README | None are broken |
| 5 | Open the README on GitHub on your phone | Images load and the page is readable |
| 6 | Seed production, log in as the demo NGO | Listings visible on the map |
| 7 | Run the cleanup script on production | "Deleted N listings and 2 demo users" |
| 8 | Watch your demo video without sound | You can still follow what is happening |
| 9 | Say the 2-minute pitch without notes | Under 2:30, covers all five beats |
| 10 | Mock interview recording | You answered 12 questions; weak ones are on your study list |
| 11 | `git tag` | `v1.0.0` exists on GitHub under Releases or Tags |

### 🧠 Self-ask questions

1. Who is the README for, and what are the first three things they want to know?
2. Why does the fresh-clone test catch problems that "it works on my machine" hides?
3. Why must seeded demo data be re-seeded right before a demo?
4. Why do the seed and cleanup scripts refuse to touch non-dev databases without `--force`?
5. What would go wrong if demo accounts with the password `Demo@12345` stayed on the live site?
6. Walk through the life of "NGO clicks Claim" from memory, from the click to every screen that updates.
7. What is the hardest bug you hit, and how did you find it? (Interviewers love this question.)
8. Pick one trade-off from your decisions log and argue **for the option you rejected**.
9. What does your project **not** do, and how would you say that honestly in an interview?
10. How do you answer "did AI write this?" without being defensive or dishonest?
11. If an interviewer asks "how would this handle 100,000 users?", what is your answer in three steps?
12. What did you learn about *learning* over these ten days?

<details>
<summary>Hints (check after you've written your answers)</summary>

1. Recruiters and interviewers. What it is, a way to see it working, and the tech used.
2. Your machine has files, settings and installed tools that the README never mentions. A clean clone has none of them.
3. Listings expire 1 to 6 hours after seeding, so old demo data is already expired and the map looks empty.
4. A one-letter mistake in an environment variable could otherwise delete or pollute live data.
5. Anyone who read your README or interview answer could log in and post as the demo donor.
6. React click, Axios attaches the token, `protect` and `restrictTo`, atomic `findOneAndUpdate`, 409 if lost, socket events after the write, rooms, screens update.
7. Strong answers describe: the symptom, a hypothesis, how you tested it, the fix, and what you now do to prevent it.
8. Example: polling is simpler, uses fewer server resources, and works through every proxy; the cost is up to N seconds of delay.
9. Name two or three: payments, verification of NGOs, notifications, multi-server scaling. Honesty about scope reads as maturity.
10. "I used it as a tutor and pair programmer and I can explain every line. Here's an example where I corrected it."
11. Indexes and measuring first, then caching hot reads (like stats), then more servers with a Redis adapter for sockets and rate limits.
12. Your own answer. A good one mentions explaining things out loud, breaking things on purpose, or writing decisions down.

</details>

### 🤖 Use AI like this

- *"Act as a technical interviewer for a junior full-stack role. Ask me one question at a time about my project AnnaSeva (MERN, Socket.IO, atomic claim). After each of my answers, tell me what was vague or wrong before asking the next. Don't give me the answers unless I ask."*
- *"Here is my README. Read it as a recruiter with two minutes. What would make you stop reading? What's missing? Don't rewrite it; list problems in order of importance."*
- *"Here's my 2-minute pitch: [paste]. Where would a non-technical listener get lost? Mark any jargon I haven't explained."*
- *"Ask me five follow-up questions that an interviewer might ask about my atomic claim code, going deeper each time."*

### ⚠️ Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| README that only lists technologies | Reader can't tell what the project does | Start with the problem and a screenshot |
| No live link, or a link that isn't mentioned as slow to wake | Reviewer sees a spinner for a minute and leaves | Add the link plus "the free server may take about a minute to wake" |
| Setup steps that were never tested on a clean machine | "npm install" works but nothing runs | The fresh-clone test |
| Seeding production with `Demo@12345` | A published password protecting a public site | Strong private password, then cleanup |
| Seeding the night before | Listings expired; empty map at the demo | Seed 30 minutes before |
| Recording the video on a cold server | Long loading screens in your demo | Warm up first, record after |
| Unrehearsed live demo | Fumbling, long pauses | Script and rehearse; have the video as backup |
| Claiming skills the project doesn't show | One follow-up question exposes it | Say what you built, and be clear on scale |
| Memorising answers word for word | Sounds robotic; collapses on a follow-up | Learn the structure (problem, approach, trade-off), not a script |
| Leaving the 10-day plan file as the README | Confusing for visitors | `plan.md` lives in `docs/`; `README.md` is its own thing |

### Definition of done

- [ ] `README.md` has: problem, live link, video link, screenshots, features, stack, architecture diagram, run-locally steps, environment variable table, decisions and trade-offs, tests, roadmap
- [ ] Fresh-clone test passed
- [ ] `.env.example` files complete; no secrets in Git history (re-check with `git log --all -- server/.env`)
- [ ] Production demo data seeded with a private password, and you've run the cleanup at least once on a test seed
- [ ] Demo video recorded, uploaded and linked
- [ ] GitHub About box filled; repo pinned; tag `v1.0.0` pushed
- [ ] `docs/interview-notes.md` complete
- [ ] You recorded and reviewed a mock interview
- [ ] Retrospective written in `docs/journal.md`

### Git checkpoint

```bash
git add README.md docs/images
git commit -m "docs: README with screenshots, diagram and setup steps"
git add docs/interview-notes.md docs/scaling-notes.md docs/decisions.md
git commit -m "docs: interview notes and final decisions"
git add server/scripts/cleanup-demo.js server/scripts/seed.js
git commit -m "chore(scripts): demo cleanup script and configurable demo password"
git add server/.env.example client/.env.example server/package.json
git commit -m "chore: complete env examples and node engine"
git switch main && git merge docs/final && git push
git tag -a v1.0.0 -m "AnnaSeva v1.0.0" && git push --tags
```

### Explain-back (the 2-minute pitch)

Say this aloud, in your own words, until it flows:

> **Problem:** "Restaurants and caterers throw away edible food every night, while NGOs struggle to find surplus food in time. **Solution:** AnnaSeva lets a donor post surplus food with a pickup window and location; nearby NGOs see it on a live map and claim it. Only one can win. **How it's built:** a React front end on Vercel talks to an Express API on Render, which stores data in MongoDB Atlas; Socket.IO pushes live updates. **Hardest problem:** two NGOs clicking Claim at the same instant. A check-then-update lets both win, so I made the claim a single atomic database operation and proved it with a test that fires 20 requests at once: exactly one wins. **A trade-off:** I stored expiry as a time and compute 'expired' in queries instead of running a cron job: fewer moving parts, and the history stays for the impact counter. **Next:** notifications, NGO verification, and an AI feature that drafts a listing from a photo."

### Resources

- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repository-settings-and-features/customizing-your-repository/about-readmes)
- [Mermaid diagrams on GitHub](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
- [OBS Studio](https://obsproject.com/) (free screen recording)
- [Choose a License](https://choosealicense.com/)
- [Semantic Versioning](https://semver.org/) (why the tag is `v1.0.0`)
- [Node.js: `--env-file`](https://nodejs.org/api/cli.html)

### What now?

1. **Take a day off.** Seriously. Learning consolidates during rest.
2. **Show it to three people** (a developer, a non-developer, a possible user such as a restaurant owner or NGO volunteer). Watch them use it **without helping**. Write down where they get stuck.
3. **Fix the top three problems they find.** That is real product development.
4. Then pick from **Appendix E** or start your next project. A second, different project teaches more than polishing this one forever.

---

## Appendix A: Deployment Troubleshooting

**How to debug a deployment problem (always in this order):**

1. Open the browser **DevTools**: the **Console** tab (red errors) and the **Network** tab (click the failing request: status code, response body, headers).
2. Open the **Render logs** (server side) and the **Vercel deployment log** (build side).
3. Decide **where** it fails: the browser, the network, the server, or the database. Then use the table.

| Symptom | Most likely cause | Fix |
|---|---|---|
| Console: *"blocked by CORS policy"* | `CLIENT_URL` on Render doesn't **exactly** match your Vercel URL (trailing `/`, `http` vs `https`, or a Vercel *preview* URL instead of the production one) | Set `CLIENT_URL=https://your-app.vercel.app` (no slash). Render redeploys. Hard-refresh |
| CORS error only for WebSockets | Socket.IO has its **own** CORS option | `new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } })` |
| Requests go to `https://your-app.vercel.app/undefined/...` or to `localhost` | `VITE_API_URL` missing or wrong **at build time** | Set it in Vercel's environment settings, then **redeploy**. `VITE_` variables are baked into the build; changing them does nothing until a new build |
| Refreshing `/donor` shows a 404 on Vercel | Missing SPA rewrite | `client/vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`, and Vercel's **Root Directory** set to `client` |
| Blank white page on Vercel | Build output or root directory wrong; or a runtime error | Vercel settings: Root Directory `client`, Build `npm run build`, Output `dist`. Then read the Console |
| Vercel build fails: *"Cannot find module './components/navbar'"* | Wrong capitalisation. macOS and Windows ignore case; Vercel's Linux does not | Match the exact filename case in every import |
| Render deploy fails or service won't start | Wrong Root Directory, build or start command | Root Directory `server`, Build `npm install`, Start `npm start`. The server must listen on `process.env.PORT` |
| Render logs: `MongoServerSelectionError` | Atlas **Network Access** doesn't allow Render; or wrong URI | Atlas > Network Access > allow `0.0.0.0/0` (Render's free tier has no fixed IP). Re-check user, password, database name |
| Render logs: `bad auth` / *authentication failed* | Wrong database-user password, or special characters not URL-encoded | Reset the DB user's password to letters and numbers, update `MONGO_URI` on Render |
| `querySrv ECONNREFUSED` locally | Your network or ISP blocks the DNS lookup behind `mongodb+srv://` | Try another network or DNS (such as 8.8.8.8), or use Atlas's non-SRV connection string |
| Login works locally but not live | You set variables in `.env`, but Render doesn't read your `.env` file | Set every variable in Render's **Environment** tab |
| Everyone is suddenly logged out after a deploy | `JWT_SECRET` changed, so old tokens no longer verify | Expected. Log in again. Don't rotate the secret casually |
| Every request is `429` for everybody | Missing `trust proxy`, so all users share one rate-limit counter | `app.set('trust proxy', 1)` and verify the IP (Day 9) |
| First request after a quiet period takes about a minute | Render's free instance spun down after 15 minutes without traffic | Open the app a couple of minutes before a demo. It is not a bug |
| Service suspended near the end of the month | The free allowance is 750 instance hours per month **for the whole workspace**; several always-on services can exhaust it | Run fewer services; check the Render dashboard |
| Map shows grey tiles or no tiles | Leaflet's CSS isn't imported, or the map container has no height | `import 'leaflet/dist/leaflet.css'`, and give the container a height (`h-72`) |
| Pins appear in the wrong country | Longitude and latitude swapped | GeoJSON is **[longitude, latitude]**; Leaflet markers want **[latitude, longitude]** |
| Geolocation never asks for permission | The page isn't on HTTPS, or the browser blocked it earlier | Vercel is HTTPS. Reset the site permission in the browser's address-bar menu |
| Live updates stop after the page was idle | Server asleep, or the connection dropped | Reconnect logic should **re-fetch** from the API (Day 8) |
| Data you seeded locally isn't on the live site | Production uses a different database (`annaseva`, not `annaseva_dev`) | Seed production deliberately (Day 10) |
| Atlas cluster unreachable after a long break | Inactive free clusters may be paused | Resume it from the Atlas dashboard |

---

## Appendix B: README Template

Copy everything between the lines into `README.md`, then replace every `[placeholder]`. The outer fence below uses four backticks because the template itself contains code fences.

````markdown
# AnnaSeva

> Connecting surplus food with the people who need it, before it spoils.

[Live demo](https://your-app.vercel.app) · [2-minute video](https://your-video-link) · [API health check](https://your-api.onrender.com/api/health)

> **Note:** the live demo runs on free hosting. If the app has been idle, the server may take about a minute to wake up.

![AnnaSeva: NGO map view](docs/images/ngo-map.png)

## The problem

[2 to 3 sentences in your own words: who wastes food, who needs it, why they don't find each other in time.]

## What it does

- **Donors** (restaurants, caterers, hostels) post surplus food with quantity, pickup address, location and an expiry time.
- **NGOs** see nearby available food on a map and in a list, updated **live**, and claim it.
- **Only one NGO can claim a listing**, even if two click at the same instant (an atomic database operation).
- Donors confirm pickups; a public counter shows meals rescued.

## Screenshots

| Donor dashboard | NGO map | Mobile |
|---|---|---|
| ![](docs/images/donor.png) | ![](docs/images/ngo-map.png) | ![](docs/images/mobile.png) |

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Front end | React, Vite, React Router, Tailwind CSS, Leaflet | [one-line reason] |
| Back end | Node.js, Express | [reason] |
| Database | MongoDB Atlas, Mongoose | Geospatial queries (find within N km) |
| Real time | Socket.IO | Live updates; falls back gracefully |
| Auth and security | JWT, bcrypt, Zod, helmet, rate limiting | [reason] |
| Hosting | Vercel (client), Render (server), Atlas (database) | Free tiers |

## Architecture

```mermaid
flowchart LR
  Browser["React app (Vercel)"] -->|"HTTPS + JSON"| API["Express API (Render)"]
  API -->|"live events"| Browser
  API --> DB[("MongoDB Atlas")]
```

[3 to 5 sentences: the request flow for "NGO clicks Claim".]

## Interesting engineering problems

1. **Double claims.** [What went wrong with check-then-update, and how the atomic `findOneAndUpdate` fixes it. Mention the 20-request test.]
2. **Geospatial search.** [GeoJSON order, the 2dsphere index, `$near`.]
3. **Real-time design.** [Socket.IO rooms, authenticated sockets, re-fetch after reconnect, why the database stays the source of truth.]

## Decisions and trade-offs

| Decision | Alternatives | Why I chose this | Cost |
|---|---|---|---|
| [Socket.IO] | [Polling, SSE] | [...] | [...] |
| [Expiry computed in queries] | [Cron job] | [...] | [...] |
| [JWT in localStorage] | [httpOnly cookie] | [...] | [...] |

More in [`docs/decisions.md`](docs/decisions.md).

## Run it locally

**Prerequisites:** Node.js 22 or newer, Git, and a free MongoDB Atlas cluster.

```bash
git clone https://github.com/[you]/annaseva.git
cd annaseva

# 1) Server
cd server
npm install
cp .env.example .env        # then edit .env (see the table below)
npm run dev                 # http://localhost:5000

# 2) Client (in a second terminal)
cd client
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173

# 3) Optional: demo data for a *_dev database
cd server && node scripts/seed.js 15
```

### Environment variables

| File | Variable | Example | Meaning |
|---|---|---|---|
| `server/.env` | `PORT` | `5000` | Port the API listens on |
| `server/.env` | `MONGO_URI` | `mongodb+srv://USER:PASS@cluster.mongodb.net/annaseva_dev` | Atlas connection string |
| `server/.env` | `JWT_SECRET` | a long random string | Signs login tokens |
| `server/.env` | `CLIENT_URL` | `http://localhost:5173` | Allowed front-end origin (CORS) |
| `server/.env` | `RATE_LIMIT_MAX` | `1000` | Optional: general requests per 15 minutes per IP |
| `client/.env` | `VITE_API_URL` | `http://localhost:5000/api` | Where the API lives |
| `client/.env` | `VITE_SOCKET_URL` | `http://localhost:5000` | Where Socket.IO connects (no `/api`) |

## Tests

```bash
cd server && npm test
```

[One sentence on what is covered. Add: `node scripts/race-test.js <listingId> <ngoToken>` fires 20 simultaneous claims and expects exactly one success.]

## API overview

| Method | URL | Who | Purpose |
|---|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | anyone | Create account, get a token |
| POST | `/api/listings` | donor | Post surplus food |
| GET | `/api/listings/nearby` | NGO | Available listings within a radius |
| PATCH | `/api/listings/:id/claim` | NGO | Atomic claim (200, or 409 if too late) |
| GET | `/api/stats` | anyone | Meals rescued |

## Roadmap

- [ ] [Notifications (email or push)]
- [ ] [NGO verification and an admin panel]
- [ ] [AI: draft a listing from a photo]

## What I learned

[3 to 4 honest sentences.]

## License

MIT
````

---

## Appendix C: Interview Questions

Practise out loud. For each one: **direct answer, why, trade-off, what you'd change.** The right column lists what a strong answer touches on.

### About the project

| Question | A strong answer includes |
|---|---|
| Describe the project in 30 seconds. | Problem, users, the core interaction, one standout feature |
| Why this idea? | A real problem, several user types, clear scope you could finish |
| What was the hardest problem? | A specific bug or design problem, how you diagnosed it, what you learned |
| What would you do with another month? | Notifications, NGO verification, tests for more flows, monitoring |
| What does it **not** do well? | Honest limits: demo scale, free-tier hosting, no verification of NGOs |

### Architecture and system design

| Question | A strong answer includes |
|---|---|
| Walk me through what happens when an NGO clicks Claim. | Click, Axios + token, `protect`, `restrictTo`, atomic update, 409 if lost, event after the write, screens update |
| How would you scale it 100x? | Measure first, indexes, cache hot reads like stats, more servers with a Redis adapter for sockets and rate limits, managed database tier |
| What is the first thing that would break? | Free database throttling, then the single Node process |
| Why is the database the source of truth, not the socket events? | Events can be missed during disconnects; clients re-fetch on reconnect |
| Why separate `app.js` and `server.js`? | Testability (import the app without opening a port), and Socket.IO attaches to the HTTP server |
| REST: what do the methods and status codes mean? | GET reads, POST creates, PATCH updates; 200, 201, 400, 401, 403, 404, 409, 429, 500 |

### Backend and database

| Question | A strong answer includes |
|---|---|
| What is middleware? | A function between request and handler; `protect`, `restrictTo`, `validate`; order matters |
| Why check-then-update is a bug, and how `findOneAndUpdate` fixes it | Race condition; the condition and the change happen as one atomic operation |
| What does a `2dsphere` index do? | Enables geospatial queries such as `$near`; longitude comes first |
| Why reference the donor by id instead of embedding it? | Donor data changes; avoids stale copies; populate when needed |
| Why not store "expired" as a status? | It's derived from `expiresAt`; no cron job; history preserved |
| What is an index and what does it cost? | Faster reads; extra storage and slower writes; measure with `explain()` |
| Why is MongoDB a reasonable fit here? What's a reason you might choose SQL instead? | Flexible documents and built-in geo versus strongly relational data and joins |

### Authentication and security

| Question | A strong answer includes |
|---|---|
| How does login work? | Hash comparison with bcrypt, signed JWT, sent as `Authorization: Bearer`, verified on every request |
| Why hash passwords? Why not encrypt? | One-way; a leaked database shouldn't reveal passwords |
| What is a JWT? What's in it? Can it be forged? | Signed (not secret) claims; can't be forged without the secret |
| Where do you store the token, and what's the downside? | `localStorage`: simple but exposed to XSS; httpOnly cookies are the alternative |
| What is CORS and why did you need it? | Browser rule between origins; server allows the front-end origin |
| What is rate limiting and why does login get a stricter one? | Counting requests per IP; slows password guessing |
| What is "broken access control"? How did you prevent it? | Ownership checks on every mutation; role checks; the server is the lock |
| Why validate on the server when the form already validates? | Anyone can bypass the form |

### Frontend

| Question | A strong answer includes |
|---|---|
| Why Context for auth? | Shared state without prop-drilling; small app, no need for Redux |
| What are the four states of a data screen? | Loading, error, empty, data |
| What is `useEffect` cleanup for? | Stop timers and listeners; avoids duplicate socket handlers |
| Controlled forms: what and why? | State is the single source of truth for input values |
| How does `ProtectedRoute` work, and is it security? | Redirects by role; it's UX, the server enforces access |
| How did you handle the longitude/latitude order? | GeoJSON `[lng, lat]`; Leaflet `[lat, lng]`; convert at the boundary |

### Real time

| Question | A strong answer includes |
|---|---|
| Polling vs SSE vs WebSockets | One-way vs two-way, cost, simplicity; polling every 10 s is valid for small apps |
| What are Socket.IO rooms? | Named groups; NGOs share a room, each user has a private one |
| How are sockets authenticated? | Token in the handshake, verified by socket middleware |
| What breaks with two server instances? | Events don't cross servers; Redis adapter and sticky sessions |
| Why is `claimedBy` hidden from other NGOs? | Data minimisation: send only what each audience needs |

### Deployment, testing and process

| Question | A strong answer includes |
|---|---|
| Walk me through your deployment. | Atlas (network access, DB user), Render (env vars, start command), Vercel (build-time `VITE_` vars, rewrites) |
| Why separate dev and production databases? | Experiments can't wreck live data |
| What did you test, and what didn't you? | Validators and API error handling, race test; honest gaps (no end-to-end browser tests) |
| What is a unit test vs an integration test? | One function vs several parts together |
| How did you use Git? | Feature branches, small commits, conventional messages |
| How did you use AI while building? | Tutor and pair programmer; explained code before keeping it; corrected it when it was outdated |

### Behavioural

| Question | A strong answer includes |
|---|---|
| Tell me about a time you were stuck. | The 20-minute rule, narrowing the problem, asking a precise question |
| Tell me about a mistake you made. | A real mistake, what you changed, what you do differently now |
| How do you learn something new? | Build, break, explain; the plan you just followed |
| Why this role / company? | Specific and honest; connect to what you built |

---

## Appendix D: Demo Script, Pitches and Event Checklist

### The 2-minute demo video

Two browser windows side by side: **donor on the left, NGO on the right.** Speak slowly.

| Time | Show | Say |
|---|---|---|
| 0:00 to 0:15 | Landing page and counter | "Restaurants waste edible food while NGOs struggle to find it in time. AnnaSeva connects them." |
| 0:15 to 0:35 | NGO window: the map with pins | "An NGO sees available food nearby, on a map and in a list. Everything here is live." |
| 0:35 to 1:00 | Donor posts a listing | "A donor posts what's left: what it is, how much, until when, and where. The location comes from the browser." |
| 1:00 to 1:15 | NGO window updates without refresh | "The NGO sees it **instantly**, no refresh. That's Socket.IO pushing the event." |
| 1:15 to 1:35 | NGO claims; donor window updates | "Only one NGO can claim. Even if two click at the same instant, the database applies one winner." |
| 1:35 to 1:50 | Donor marks picked up; counter increases | "The donor confirms the pickup, and the meals count toward the total." |
| 1:50 to 2:00 | README / architecture diagram | "React, Express, MongoDB, deployed on Vercel, Render and Atlas. Code and write-up on GitHub." |

### Pitches

**30 seconds:** "AnnaSeva connects restaurants that have leftover food with nearby NGOs. A donor posts it, NGOs see it on a live map, and the first to claim it collects it, so food gets eaten instead of thrown away. I built it full stack in React, Node and MongoDB, with real-time updates, and deployed it."

**2 minutes:** the Day 10 explain-back.

**5 minutes (live walkthrough):** the 2-minute story, then (1) show the code for the atomic claim, (2) show the race test result, (3) show the decisions log, (4) answer one question from Appendix C.

### Event-day checklist

- [ ] **T minus 60 min:** seed production demo data; confirm both demo accounts work
- [ ] **T minus 30 min:** open the live site and log in on both devices (wakes the free server); do one complete rehearsal
- [ ] Two devices charged; phone hotspot ready as backup internet
- [ ] Location permission granted for the site on both devices
- [ ] Notifications and Do Not Disturb on; unrelated tabs closed; browser zoom at 125%
- [ ] Backup: the demo video file saved on the laptop; screenshots in a folder
- [ ] If many people will try the app on the same Wi-Fi, raise `RATE_LIMIT_MAX` on Render beforehand (rate limits count per IP address)
- [ ] Written fallback line if the live site fails: "Let me show the recorded demo while this wakes up."
- [ ] After the event: run the cleanup script and tidy the production database

---

## Appendix E: Stretch Goals

Only start these **after** `v1.0.0` is tagged and your README is finished.

| Goal | Level | What you'd learn | Notes |
|---|---|---|---|
| **GitHub Actions: run `npm test` on every push** | 🟡 | CI basics | A small YAML file; very impressive for how little work it is |
| **Email notification to NGOs** (a new listing nearby) | 🟡 | Background tasks, third-party APIs | Use a transactional email service's free tier; never put API keys in the client |
| **Volunteer / delivery role** | 🟡 | More roles, state machine design | Extends the status flow |
| **Ratings and reviews** | 🟡 | Data modelling, abuse prevention | |
| **Admin panel and NGO verification** | 🔴 | Authorization design | Needed before real-world use |
| **End-to-end tests with Playwright** | 🔴 | Browser automation | Test the donor-posts, NGO-claims journey |
| **Redis adapter + shared rate-limit store** | 🔴 | Horizontal scaling | The exact thing your design review described |
| **Progressive Web App (installable)** | 🟡 | Service workers, manifest | NGO volunteers could install it on their phones |
| **TypeScript migration** | 🔴 | Static types | Do it as a separate branch and write up the experience |
| **AI: photo to draft listing** | 🔴 | Calling an AI model from a server | See below |

**AI feature outline (the natural bridge to AI-focused roles):** a donor takes a photo; the **server** (never the browser) sends it to a vision-capable model with a strict prompt asking for a title, food type and rough portions as JSON; you validate the reply with **Zod** (never trust model output), show it to the donor as a *draft*, and they confirm or edit before posting. Things to think about and write down: API keys stay in server environment variables; per-user rate limits and cost; photos may contain people (privacy); what happens when the model is wrong (the human confirms); and food safety (the model must **never** decide whether food is safe to eat).

---

## Appendix F: Glossary

| Term | Plain-English meaning |
|---|---|
| **API** | A menu of requests a server understands and answers |
| **Aggregation** | A database operation that combines many rows into summary numbers (like a pivot table) |
| **Async / await** | Waiting for slow things (database, network) without freezing everything else |
| **Atomic** | Happens as one indivisible step; nobody can sneak in between |
| **Axios** | A library for sending HTTP requests from JavaScript |
| **bcrypt** | A one-way scrambler for passwords |
| **Branch** | A parallel copy of your code history for working on a feature safely |
| **CORS** | A browser rule about which websites may call which servers |
| **CRUD** | Create, Read, Update, Delete: the four basic data operations |
| **Collection / document** | MongoDB's spreadsheet tab / one row |
| **Commit** | A saved snapshot of your code with a message |
| **Component** | A reusable piece of React screen |
| **Context** | React's way of sharing data (such as "who is logged in") without passing it down by hand |
| **Controller** | The function that does the work for one route |
| **Environment variable** | A setting or secret kept outside the code |
| **Express** | The framework that receives requests and sends responses in Node |
| **GeoJSON** | A standard format for map data; points are `[longitude, latitude]` |
| **Git / GitHub** | Version history for code / a website that stores it online |
| **Hash** | The scrambled, one-way form of a password |
| **Header** | Extra information sent with a request or response |
| **Hook (React)** | A function such as `useState` that adds abilities to a component |
| **HTTP** | The language browsers and servers use to talk |
| **Index** | A shortcut the database keeps so it needn't read everything |
| **JSON** | Text format for structured data: `{ "name": "Asha" }` |
| **JWT** | A signed login "wristband" the server can verify |
| **Middleware** | A function that runs between the request arriving and the route handling it |
| **Mongoose** | A library that gives MongoDB data a defined shape |
| **Node.js** | JavaScript outside the browser |
| **npm** | Node's package manager (installs libraries) |
| **ObjectId** | MongoDB's unique id for a document |
| **Polling** | Asking "anything new?" every few seconds |
| **Port** | A numbered door on a computer where a program listens |
| **Proxy** | A middle server that forwards requests |
| **Race condition** | A bug where the result depends on which of two simultaneous actions wins |
| **Rate limiting** | Refusing requests from someone who sends too many too fast |
| **REST** | A convention for designing APIs around resources and HTTP methods |
| **Route** | A method + path paired with a function |
| **Schema** | A description of the shape of data |
| **Socket.IO** | A library for open two-way connections between browser and server |
| **State (React)** | Data that, when it changes, redraws the screen |
| **Status code** | A number summarising a response: 200 OK, 404 not found, 429 too many requests |
| **Token** | A string that proves who you are |
| **Unit test** | A small program that checks one function |
| **Validation** | Checking that input is well-formed before using it |
| **Vite** | The tool that runs and builds the React app |
| **WebSocket** | The browser feature behind live, two-way connections |
| **XSS** | An attack where a malicious script runs on your page |
| **Zod** | A library for describing and checking valid data |

---

## Appendix G: Resources

**Core web skills**

- [MDN: Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)
- [javascript.info](https://javascript.info/) (the modern JavaScript tutorial)
- [MDN: Express/Node tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)

**The stack**

- [React: Learn](https://react.dev/learn)
- [Vite guide](https://vite.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Express](https://expressjs.com/)
- [Mongoose guide](https://mongoosejs.com/docs/guide.html)
- [MongoDB University](https://learn.mongodb.com/) (free courses)
- [MongoDB geospatial queries](https://www.mongodb.com/docs/manual/geospatial-queries/)
- [Zod](https://zod.dev/)
- [Socket.IO docs](https://socket.io/docs/v4/)
- [Leaflet](https://leafletjs.com/) and [React Leaflet](https://react-leaflet.js.org/)

**Hosting**

- [Render docs](https://render.com/docs) and [free tier limits](https://render.com/docs/free)
- [Vercel docs](https://vercel.com/docs)
- [MongoDB Atlas docs](https://www.mongodb.com/docs/atlas/) and [free cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)

**Git and professional habits**

- [Pro Git (free book)](https://git-scm.com/book/en/v2)
- [GitHub Skills](https://skills.github.com/)

**Security and quality**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [web.dev: Learn](https://web.dev/learn)
- [Node.js test runner](https://nodejs.org/api/test.html)

**System design (for later)**

- [The System Design Primer](https://github.com/donnemartin/system-design-primer)
- *Designing Data-Intensive Applications* by Martin Kleppmann (a book for after a few projects)

---

## Appendix H: Progress Tracker

Copy this table into `docs/journal.md` and update it daily. Be honest in the last column.

| Day | Theme | Built and committed | Tests pass | Explain-back done | Hours | Notes / blockers |
|---|---|:-:|:-:|:-:|---|---|
| 1 | Foundations, Git, first server | [ ] | [ ] | [ ] | | |
| 2 | Users and authentication | [ ] | [ ] | [ ] | | |
| 3 | Listings API | [ ] | [ ] | [ ] | | |
| 4 | Claim system and system-design lab | [ ] | [ ] | [ ] | | |
| 5 | React, login screens, first deploy | [ ] | [ ] | [ ] | | |
| 6 | Donor experience | [ ] | [ ] | [ ] | | |
| 7 | NGO experience (map and claim) | [ ] | [ ] | [ ] | | |
| 8 | Real-time updates | [ ] | [ ] | [ ] | | |
| 9 | Hardening, polish, buffer | [ ] | [ ] | [ ] | | |
| 10 | Docs, demo, interview prep | [ ] | [ ] | [ ] | | |

### If you are behind

Decide using this order. **Never** skip the explain-backs to save time.

1. **Behind by less than a day:** use Day 9's buffer block.
2. **Behind by 1 to 2 days:** apply the **cut list** (Section 1): impact counter, extra tests, Socket.IO to polling, radius UI, map popups.
3. **Behind by more than 2 days:** stretch the plan to 14 to 20 days. That is normal for a beginner working part-time, and it is **not** a failure. A finished project you understand beats a rushed one you don't.
4. **Stuck on one problem for more than 20 minutes:** use the 20-minute rule in Section 10: write the question precisely, check the error, check the versions, ask AI **with context**, then ask a human.

### Whole-project final checklist

**Product**
- [ ] Donor and NGO registration and login work
- [ ] Donors can post, view, complete and cancel listings
- [ ] NGOs can search nearby, see a map, and claim
- [ ] A listing can never be claimed twice (race test passes)
- [ ] Expired listings never appear to NGOs
- [ ] Live updates work in two windows (or the polling fallback is documented)
- [ ] Loading, error and empty states exist on every data screen
- [ ] Works on a phone-sized screen and with a keyboard

**Engineering**
- [ ] Passwords hashed; tokens verified; roles and ownership enforced on the server
- [ ] Input validated on the server (Zod)
- [ ] helmet, body limit, rate limits, `trust proxy` verified
- [ ] `npm test` passes; race test passes
- [ ] No secrets in Git history; `.env.example` files complete
- [ ] Separate dev and production databases

**Delivery**
- [ ] Live on Vercel + Render + Atlas
- [ ] README complete; fresh-clone test passed
- [ ] Demo video recorded and linked
- [ ] `docs/decisions.md`, `docs/scaling-notes.md`, `docs/interview-notes.md` written
- [ ] Tag `v1.0.0` pushed

**Understanding (the real finish line)**
- [ ] I can explain the request lifecycle, the atomic claim, JWT auth, Socket.IO rooms and the deployment setup **without looking at code**
- [ ] I can name five trade-offs and defend each
- [ ] I can say honestly what the project does not do