# AnnaSeva — Production Demo & Data Hygiene Guide

This guide details the procedure for safely preparing, seeding, presenting, and cleaning up demo data on production and staging environments for AnnaSeva.

---

## 1. Safety Architecture

A primary operational hazard in full-stack applications is accidental test data pollution or catastrophic truncation of live production data. AnnaSeva incorporates dual-layer programmatic safeguards into both [`server/scripts/seed.js`](../server/scripts/seed.js) and [`server/scripts/cleanup-demo.js`](../server/scripts/cleanup-demo.js):

1. **Database Name Inspection:**
   ```javascript
   const dbName = mongoose.connection.name;
   if (!dbName.endsWith('_dev') && !FORCE) {
     console.error('Refusing to touch a non-dev database. Re-run with --force if you really mean it.');
     process.exit(1);
   }
   ```
   Unless the target MongoDB database name explicitly ends with `_dev`, both scripts immediately abort execution unless the human operator passes the `--force` flag.

2. **Scoped Cleanup Targeting:**
   The cleanup script never runs a blanket collection drop. It specifically resolves the exact `_id`s of `donor.demo@example.com` and `ngo.demo@example.com`, and deletes only:
   - Listings posted by the demo donor.
   - Listings claimed by the demo NGO.
   - The two demo user records themselves.
   Legitimate user accounts and community donation history remain untouched.

3. **Configurable Private Passwords:**
   Never publish or hardcode passwords in production scripts. Both scripts accept an environment override:
   ```bash
   DEMO_PASSWORD="your-strong-private-passphrase" node ...
   ```

---

## 2. Demo User Profiles

| Field | Demo Donor Account | Demo NGO Account |
|---|---|---|
| **Role** | `donor` | `ngo` |
| **Email** | `donor.demo@example.com` | `ngo.demo@example.com` |
| **Name** | Demo Donor | Demo NGO |
| **Organization** | Spice Garden Restaurant | Helping Hands Trust |
| **Phone** | `+91 98765 43210` | `+91 98765 12345` |
| **Default Password** | Configurable via `DEMO_PASSWORD` (Local default: `Demo@12345`) | Configurable via `DEMO_PASSWORD` (Local default: `Demo@12345`) |

---

## 3. Production Seeding Procedure

> ⚠️ **CRITICAL AUTHORIZATION RULE:** Never execute production seeding without explicit authorization from the repository owner.

### Exact Command
```bash
# In server/ directory
DEMO_PASSWORD="<STRONG_PRIVATE_PASSPHRASE>" node --env-file=.env.production scripts/seed.js 12 --force
```

### Execution Breakdown
1. **Target Database:** Connects to the database specified in `.env.production` (e.g., `annaseva`).
2. **Verification Step:** The first log line prints:
   `Connected to database: annaseva`
   *If it prints `annaseva_dev`, the wrong environment file was loaded; abort immediately.*
3. **Users Created / Updated:** Checks for `donor.demo@example.com` and `ngo.demo@example.com`. Creates them if absent with the hashed `DEMO_PASSWORD`.
4. **Listings Created:** Inserts 12 fresh food listings scattered in an 8 km radius around the center coordinates (Pune: 18.5204° N, 73.8567° E).
5. **Expiry Window:** All seeded listings are assigned an `expiresAt` between **2 to 6 hours** from the moment of execution.
   > **Note:** Because listings expire in 2–6 hours, seed the production database **30–45 minutes prior** to your live presentation, not the night before.

---

## 4. Production Cleanup Procedure

Run this immediately after concluding your live demonstration or interview to ensure no demo accounts or temporary listings remain visible to the public.

### Exact Command
```bash
# In server/ directory
node --env-file=.env.production scripts/cleanup-demo.js --force
```

### Execution Breakdown
1. **Target Database:** Connects to `annaseva` (production).
2. **Targeted Records Deleted:**
   - Listings where `donor` is `donor.demo@example.com`
   - Listings where `claimedBy` is `ngo.demo@example.com`
   - The user documents for `donor.demo@example.com` and `ngo.demo@example.com`
3. **Output Confirmation:**
   `✅ Cleanup complete: Deleted 12 demo listings and 2 demo users.`

---

## 5. Demonstration Day Checklist

### T-Minus 60 Minutes (Preparation)
- [ ] Connect laptop to stable internet and verify power source.
- [ ] Verify production deployment health:
  ```bash
  curl -s https://annaseva-api.onrender.com/api/health
  # Expected: {"status":"ok","time":"..."}
  ```
- [ ] Run production seed script with a strong private demo password:
  ```bash
  DEMO_PASSWORD="your-strong-pass" node --env-file=.env.production scripts/seed.js 12 --force
  ```

### T-Minus 30 Minutes (Warm-up & Rehearsal)
- [ ] Open two browser windows side-by-side:
  - **Left Window (Donor):** `https://annaseva.vercel.app/login` (Incognito window A)
  - **Right Window (NGO):** `https://annaseva.vercel.app/login` (Incognito window B)
- [ ] Log in as Donor on the left; confirm active listings appear.
- [ ] Log in as NGO on the right; confirm map pins load and radius filter is set to 10 km.
- [ ] Verify Render backend is fully awake (avoids the 50s cold-start lag during the presentation).
- [ ] Zoom both browser viewports to 110% or 125% for maximum audience readability.
- [ ] Mute notifications and close unrelated desktop apps.

### T-Minus 5 Minutes (Ready State)
- [ ] Test one claim on a test listing and verify real-time Socket.IO update pushes across windows.
- [ ] Have the 2-minute backup demo video open in a background tab in case venue Wi-Fi fails.

### T-Plus 0 (Showtime!)
- [ ] Follow the structured 2-minute narrative: Problem -> Map -> Post -> Live Push -> Atomic Claim -> Fulfillment -> Impact Counter.

### T-Plus End (Tear-down & Hygiene)
- [ ] Run the cleanup script to remove demo data from production:
  ```bash
  node --env-file=.env.production scripts/cleanup-demo.js --force
  ```
- [ ] Confirm cleanup output confirms zero remaining demo records.
