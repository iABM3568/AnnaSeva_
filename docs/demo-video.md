# AnnaSeva — Two-Minute Demonstration Video Script & Recording Guide

This document contains the exact spoken narration script, visual cues, recording setup, and delivery guidelines for recording the two-minute portfolio demonstration video.

---

## 1. Technical Recording Specifications

- **Target Duration:** Exactly 2 minutes (120 seconds). Maximum ceiling: 2 minutes 15 seconds.
- **Resolution:** 1080p Full HD (1920 × 1080) at 60 fps.
- **Audio:** Clear microphone input (headset or USB condenser mic), noise-gate applied to prevent room echo, audio levels normalized to -3 dB.
- **Display Setup:** Two browser windows arranged side-by-side:
  - **Left 50%:** Food Donor Window (`/donor`)
  - **Right 50%:** NGO Discovery Window (`/ngo`)
- **Browser Zoom:** 125% zoom on both windows to ensure typography and buttons are legible on small screens and mobile devices.
- **Pre-Recording Status:**
  - Database pre-seeded with 12 listings.
  - Render backend pre-warmed (0 latency).
  - Browser extensions and bookmarks bar hidden.
  - System notifications and audio chimes disabled.

---

## 2. Second-by-Second Narration & Action Script

| Time | Visual Screen Action | Spoken Narration (Speak slowly and deliberately) | Key Concept Conveyed |
|---|---|---|---|
| **0:00 – 0:15** | Start on the **Landing Page** (`/`). Cursor highlights the tagline and the dynamic **Meals Rescued** counter. | *"Every day, commercial kitchens throw away dozens of edible meals simply because they can't coordinate with local charities before the food spoils. This is AnnaSeva: a full-stack platform that connects surplus food donors with nearby NGOs in real time."* | The core problem, mission, and live impact counter. |
| **0:15 – 0:35** | Transition to split-screen. **Right Window (NGO):** Show the interactive Leaflet map. Click a food pin to show the popup badge (Veg, quantity, distance: 3.2 km, directions link). Adjust search radius slider from 10 km to 20 km. | *"On the right, an authenticated NGO volunteer opens the discovery view. AnnaSeva uses MongoDB 2dsphere geospatial indexing to query active donations within a customizable radius. Leaflet calculates road distances and displays diet badges, pickup deadlines, and direct Google Maps navigation."* | Geospatial indexing (`2dsphere`), Leaflet integration, volunteer UX. |
| **0:35 – 1:00** | **Left Window (Donor):** Click **+ Post Food Listing**. Type: *"Fresh Vegetable Pulao & Raita"*, Servings: *40*, Type: *Veg*, Expiry: *4 hours*. Click **Capture GPS** button (coordinates auto-populate). Submit form. | *"On the left, a banquet manager finishes lunch service. They open the donor dashboard, enter 40 servings of fresh Vegetable Pulao, set a 4-hour pickup window, and capture their kitchen's GPS coordinates with one click. They hit Publish."* | Listing creation, form validation, HTML5 Geolocation. |
| **1:00 – 1:15** | Watch **Right Window (NGO)**: Without refreshing, a new emerald marker pops onto the Leaflet map, and the listing card animates into the list with a "NEW" badge. | *"Watch the right window closely: without touching the browser or refreshing the page, the new donation appears instantly on the NGO's map. That is Socket.IO pushing an authenticated real-time broadcast across our cluster in under 100 milliseconds."* | Socket.IO WebSockets, push events, real-time discovery. |
| **1:15 – 1:35** | **Right Window (NGO):** Click **Claim Food**. Modal opens; click **Confirm Claim**. Card changes to "Claimed". **Left Window (Donor):** The listing instantly updates to "Claimed by Helping Hands Trust" with contact details. | *"The NGO clicks Claim. Under the hood, AnnaSeva prevents double-booking using an atomic MongoDB `findOneAndUpdate` with state preconditions. Even if two NGOs clicked at the exact same millisecond, the database guarantees exactly one winner. The donor immediately receives a private alert identifying the NGO."* | Concurrency control, atomic conditional writes, data minimization. |
| **1:35 – 1:50** | **Left Window (Donor):** The volunteer arrives. Donor clicks **Mark as Picked Up**. Status transitions to "Completed". Switch back to Landing page; show the **Impact Counter** increment. | *"Once the volunteer arrives and collects the containers, the donor marks the food as picked up. The listing transitions to completed, and our database aggregation pipeline dynamically increments the platform's public meals-rescued counter."* | Lifecycle completion, MongoDB aggregation pipelines. |
| **1:50 – 2:00** | Full-screen switch to the **GitHub Repository & Architecture Diagram** in `README.md`. | *"AnnaSeva is built in React 19, Node.js, Express, and MongoDB, fully hardened with rate limiting, Helmet, and 23 automated tests. The complete code and system design decisions are open-source on GitHub. Thank you."* | Technology stack, automated testing, open-source maturity. |

---

## 3. Recording Tools & Setup Guide

### Software Recommendations
- **OBS Studio (Recommended / Free):**
  - Download from [obsproject.com](https://obsproject.com/).
  - Settings: Video output 1920×1080, Framerate 60 FPS, Bitrate 6000 Kbps.
  - Audio: Mic/Auxiliary Audio with `Noise Suppression (RNNoise)` filter active.
- **Alternative:** Loom Desktop App or macOS QuickTime Screen Recording (`Cmd + Shift + 5`).

### Pre-Flight Checklist
- [ ] Both browser profiles logged in:
  - Left window: `donor.demo@example.com`
  - Right window: `ngo.demo@example.com`
- [ ] Fresh demo data loaded via `node scripts/seed.js 12`.
- [ ] Do a silent "dry run" with your mouse cursor to rehearse mouse trajectories smoothly without rapid jittering.
- [ ] Drink water before speaking; record 2 takes and select the cleanest audio.

---

## 4. Hosting & Distribution

1. **YouTube (Recommended):**
   - Upload as **Unlisted** (accessible to anyone with the link, but not publicly indexed in YouTube search).
   - Set Title: `AnnaSeva — Full-Stack Surplus Food Redistribution Platform (MERN Demo)`
   - Set Description:
     ```text
     AnnaSeva connects food donors with local NGOs in real-time before food spoils.
     Built with React 19, Node.js, Express, MongoDB Atlas, Socket.IO, and Leaflet.
     GitHub: https://github.com/iABM3568/AnnaSeva_
     Live App: https://annaseva.vercel.app
     ```
2. **Loom Alternative:**
   - Upload video and copy public shareable link.
3. **Embed in README:**
   Update the link in `README.md`:
   ```markdown
   [2-minute video](https://youtu.be/YOUR_VIDEO_ID)
   ```
