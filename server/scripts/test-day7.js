import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from '../app.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Haversine formula directly tested in Node
const toRadians = (degrees) => (degrees * Math.PI) / 180;
function distanceKm(lat1, lng1, lat2, lng2) {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}
function listingLatLng(listing) {
  const [lng, lat] = listing.location.coordinates;
  return [lat, lng];
}
function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

async function runDay7Tests() {
  console.log('====================================================');
  console.log('   DAY 7: NGO EXPERIENCE & CLAIM VERIFICATION       ');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGO_URI);
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const testId = Date.now();
  let ngo1Token = null;
  let ngo1Id = null;
  let ngo2Token = null;
  let ngo2Id = null;
  let donorToken = null;
  let targetListing1 = null;
  let targetListing2 = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Math & Geo Helper Verification
    // -------------------------------------------------------------------------
    console.log('TEST 1: Math & Geo Helpers (Haversine & Coordinate Flip):');
    const d0 = distanceKm(18.5204, 73.8567, 18.5204, 73.8567);
    if (d0 !== 0) throw new Error(`distance to self must be 0, got ${d0}`);

    // Pune (18.5204, 73.8567) to Mumbai (19.0760, 72.8777) is ~120 km
    const dPuneMumbai = distanceKm(18.5204, 73.8567, 19.076, 72.8777);
    if (dPuneMumbai < 110 || dPuneMumbai > 130) {
      throw new Error(`Pune-Mumbai distance expected ~120 km, got ${dPuneMumbai}`);
    }

    const flipped = listingLatLng({ location: { coordinates: [73.8567, 18.5204] } });
    if (flipped[0] !== 18.5204 || flipped[1] !== 73.8567) {
      throw new Error(`Coordinate flip failed: expected [18.5204, 73.8567], got ${JSON.stringify(flipped)}`);
    }

    if (formatDistance(0.45) !== '450 m' || formatDistance(3.24) !== '3.2 km') {
      throw new Error(`Distance formatting mismatch: 0.45 -> ${formatDistance(0.45)}, 3.24 -> ${formatDistance(3.24)}`);
    }
    console.log('  Haversine Pune-Mumbai: %s km (Expected ~120 km)', dPuneMumbai.toFixed(1));
    console.log('  GeoJSON [lng, lat] -> Leaflet [lat, lng] flip verified');
    console.log('  formatDistance(0.45) = "%s", formatDistance(3.24) = "%s"', formatDistance(0.45), formatDistance(3.24));
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 2: Authentication & Setup of Two Distinct NGO Accounts
    // -------------------------------------------------------------------------
    console.log('TEST 2: Two Distinct NGO Accounts & Donor Account:');
    // NGO 1
    const ngo1Res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Seva Trust NGO 1',
        email: `ngo1_${testId}@example.com`,
        password: 'Password@123',
        role: 'ngo',
        organization: 'Seva Food Foundation',
      }),
    });
    const ngo1Data = await ngo1Res.json();
    ngo1Token = ngo1Data.token;
    ngo1Id = ngo1Data.data.user._id;

    // NGO 2
    const ngo2Res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hope Kitchen NGO 2',
        email: `ngo2_${testId}@example.com`,
        password: 'Password@123',
        role: 'ngo',
        organization: 'Hope Community Relief',
      }),
    });
    const ngo2Data = await ngo2Res.json();
    ngo2Token = ngo2Data.token;
    ngo2Id = ngo2Data.data.user._id;

    // Donor
    const donorRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Royal Banquet Donor',
        email: `donor_${testId}@example.com`,
        password: 'Password@123',
        role: 'donor',
        organization: 'Royal Hospitality',
      }),
    });
    const donorData = await donorRes.json();
    donorToken = donorData.token;

    console.log('  NGO 1: %s (%s)', ngo1Data.data.user.name, ngo1Data.data.user.organization);
    console.log('  NGO 2: %s (%s)', ngo2Data.data.user.name, ngo2Data.data.user.organization);
    console.log('  Donor: %s (%s)', donorData.data.user.name, donorData.data.user.organization);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 3: Donor Posts 2 Listings in Pune for the Test
    // -------------------------------------------------------------------------
    console.log('TEST 3: Donor Creates Food Listings at Specific Pune Coordinates:');
    const now = Date.now();
    // Listing 1: Near Deccan Gymkhana Pune (18.518, 73.841)
    const list1Res = await fetch(`${baseUrl}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${donorToken}`,
      },
      body: JSON.stringify({
        title: 'Fresh Paneer Rice & Roti Platters',
        description: 'Packed after wedding reception. High food safety grade.',
        foodType: 'veg',
        quantity: 45,
        preparedAt: new Date(now - 30 * 60 * 1000).toISOString(),
        expiresAt: new Date(now + 4 * 3600 * 1000).toISOString(),
        pickupAddress: 'Royal Palace Lawns, Deccan Gymkhana, Pune',
        latitude: 18.518,
        longitude: 73.841,
      }),
    });
    const list1Data = await list1Res.json();
    targetListing1 = list1Data.listing;

    // Listing 2: Near Shivajinagar Pune (18.530, 73.850)
    const list2Res = await fetch(`${baseUrl}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${donorToken}`,
      },
      body: JSON.stringify({
        title: 'Dal Makhani & Jeera Rice Containers',
        foodType: 'veg',
        quantity: 30,
        preparedAt: new Date(now - 45 * 60 * 1000).toISOString(),
        expiresAt: new Date(now + 5 * 3600 * 1000).toISOString(),
        pickupAddress: 'Shivaji Food Hall, Station Road, Pune',
        latitude: 18.53,
        longitude: 73.85,
      }),
    });
    const list2Data = await list2Res.json();
    targetListing2 = list2Data.listing;

    console.log('  Listing 1 created: ID %s ("%s")', targetListing1._id, targetListing1.title);
    console.log('  Listing 2 created: ID %s ("%s")', targetListing2._id, targetListing2.title);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 4: NGO Geospatial Discovery (GET /api/listings/nearby)
    // -------------------------------------------------------------------------
    console.log('TEST 4: NGO Discovers Nearby Food via Geospatial Query:');
    const nearbyRes = await fetch(
      `${baseUrl}/api/listings/nearby?lat=18.5204&lng=73.8567&radiusKm=10`,
      {
        headers: { Authorization: `Bearer ${ngo1Token}` },
      }
    );
    if (nearbyRes.status !== 200) {
      throw new Error(`Expected 200 OK from /nearby, got ${nearbyRes.status}`);
    }
    const nearbyData = await nearbyRes.json();
    const foundIds = nearbyData.listings.map((l) => l._id);
    if (!foundIds.includes(targetListing1._id) || !foundIds.includes(targetListing2._id)) {
      throw new Error('Created listings not returned in nearby geospatial query');
    }
    console.log('  Nearby search (radius 10km): returned %d available listings', nearbyData.listings.length);
    console.log('  Both target listings present in results');
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 5: Radius Boundary Filtering (2 km vs 15 km)
    // -------------------------------------------------------------------------
    console.log('TEST 5: Radius Boundary Filtering (2 km vs 15 km):');
    const r2Res = await fetch(
      `${baseUrl}/api/listings/nearby?lat=18.5204&lng=73.8567&radiusKm=2`,
      {
        headers: { Authorization: `Bearer ${ngo1Token}` },
      }
    );
    const r2Data = await r2Res.json();

    const r15Res = await fetch(
      `${baseUrl}/api/listings/nearby?lat=18.5204&lng=73.8567&radiusKm=15`,
      {
        headers: { Authorization: `Bearer ${ngo1Token}` },
      }
    );
    const r15Data = await r15Res.json();

    console.log('  Radius 2km count: %d, Radius 15km count: %d', r2Data.listings.length, r15Data.listings.length);
    if (r2Data.listings.length > r15Data.listings.length) {
      throw new Error('Smaller radius returned more results than larger radius');
    }
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 6: NGO 1 Claims Listing 1 (Atomic Claim Operation)
    // -------------------------------------------------------------------------
    console.log('TEST 6: NGO 1 Claims Listing 1:');
    const claim1Res = await fetch(`${baseUrl}/api/listings/${targetListing1._id}/claim`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ngo1Token}` },
    });
    if (claim1Res.status !== 200) {
      throw new Error(`Expected 200 OK for claim, got ${claim1Res.status}`);
    }
    const claim1Data = await claim1Res.json();
    if (claim1Data.listing.status !== 'claimed') {
      throw new Error(`Expected status 'claimed', got ${claim1Data.listing.status}`);
    }
    console.log('  Claim status: %s', claim1Data.listing.status);
    console.log('  ClaimedBy: %s', claim1Data.listing.claimedBy);
    console.log('  Pickup Address revealed: "%s"', claim1Data.listing.pickupAddress);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 7: Claimed Listing Disappears from Nearby Search
    // -------------------------------------------------------------------------
    console.log('TEST 7: Claimed Listing Is Excluded from Subsequent Nearby Searches:');
    const nearbyAfterRes = await fetch(
      `${baseUrl}/api/listings/nearby?lat=18.5204&lng=73.8567&radiusKm=10`,
      {
        headers: { Authorization: `Bearer ${ngo2Token}` },
      }
    );
    const nearbyAfterData = await nearbyAfterRes.json();
    const afterIds = nearbyAfterData.listings.map((l) => l._id);
    if (afterIds.includes(targetListing1._id)) {
      throw new Error('Claimed listing still appears in available nearby listings');
    }
    console.log('  Verified: Listing 1 is no longer in available nearby listings');
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 8: NGO 2 Attempts to Claim Already-Claimed Listing (HTTP 409 Conflict)
    // -------------------------------------------------------------------------
    console.log('TEST 8: NGO 2 Attempts to Claim Listing 1 -> HTTP 409 Conflict:');
    const conflictRes = await fetch(`${baseUrl}/api/listings/${targetListing1._id}/claim`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ngo2Token}` },
    });
    if (conflictRes.status !== 409) {
      throw new Error(`Expected 409 Conflict, got ${conflictRes.status}`);
    }
    const conflictData = await conflictRes.json();
    console.log('  Server Response Status: 409 Conflict');
    console.log('  Message: "%s"', conflictData.message);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 9: Race Condition Test on Listing 2 (2 Simultaneous Claims)
    // -------------------------------------------------------------------------
    console.log('TEST 9: Simultaneous Race Condition on Listing 2:');
    const [raceRes1, raceRes2] = await Promise.all([
      fetch(`${baseUrl}/api/listings/${targetListing2._id}/claim`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${ngo1Token}` },
      }),
      fetch(`${baseUrl}/api/listings/${targetListing2._id}/claim`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${ngo2Token}` },
      }),
    ]);

    const statuses = [raceRes1.status, raceRes2.status].sort();
    console.log('  Simultaneous Request Statuses: %j', statuses);
    if (statuses[0] !== 200 || statuses[1] !== 409) {
      throw new Error(`Expected exactly one 200 and one 409, got ${JSON.stringify(statuses)}`);
    }
    console.log('  Exactly 1 Winner (HTTP 200) and 1 Conflict (HTTP 409)');
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 10: My Claims Endpoint (GET /api/listings/claimed)
    // -------------------------------------------------------------------------
    console.log('TEST 10: My Claims List with Directions Link Verification:');
    const claimsRes = await fetch(`${baseUrl}/api/listings/claimed`, {
      headers: { Authorization: `Bearer ${ngo1Token}` },
    });
    if (claimsRes.status !== 200) {
      throw new Error(`Expected 200 OK for /claimed, got ${claimsRes.status}`);
    }
    const claimsData = await claimsRes.json();
    const myClaimedIds = claimsData.listings.map((l) => l._id);
    if (!myClaimedIds.includes(targetListing1._id)) {
      throw new Error('Listing 1 not found in NGO 1 claims');
    }

    const claimItem = claimsData.listings.find((l) => l._id === targetListing1._id);
    const [cLng, cLat] = claimItem.location.coordinates;
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cLat},${cLng}`;

    console.log('  My Claims returned %d item(s)', claimsData.listings.length);
    console.log('  Claimed listing donor: %s (%s)', claimItem.donor?.name, claimItem.donor?.organization);
    console.log('  Pickup address: "%s"', claimItem.pickupAddress);
    console.log('  Google Maps URL generated: %s', gmapsUrl);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 11: Donor Dashboard Reflection & State Transition
    // -------------------------------------------------------------------------
    console.log('TEST 11: Donor Dashboard Reflection (Claimed By info):');
    const donorMineRes = await fetch(`${baseUrl}/api/listings/mine`, {
      headers: { Authorization: `Bearer ${donorToken}` },
    });
    const donorMineData = await donorMineRes.json();
    const donorListing1 = donorMineData.listings.find((l) => l._id === targetListing1._id);
    if (donorListing1.status !== 'claimed') {
      throw new Error(`Expected donor listing status 'claimed', got ${donorListing1.status}`);
    }
    console.log('  Donor dashboard reflects status: "%s"', donorListing1.status);
    console.log('  ClaimedBy populated name: "%s"', donorListing1.claimedBy?.name);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 12: Role Restriction (Donor cannot access NGO routes)
    // -------------------------------------------------------------------------
    console.log('TEST 12: Role Restriction on NGO Endpoints:');
    const forbidNearby = await fetch(`${baseUrl}/api/listings/nearby?lat=18.52&lng=73.85&radiusKm=5`, {
      headers: { Authorization: `Bearer ${donorToken}` },
    });
    const forbidClaims = await fetch(`${baseUrl}/api/listings/claimed`, {
      headers: { Authorization: `Bearer ${donorToken}` },
    });
    const forbidClaimAction = await fetch(`${baseUrl}/api/listings/${targetListing1._id}/claim`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${donorToken}` },
    });

    console.log(
      '  Nearby: HTTP %d, My Claims: HTTP %d, Claim Action: HTTP %d (Expected all 403)',
      forbidNearby.status,
      forbidClaims.status,
      forbidClaimAction.status
    );
    if (forbidNearby.status !== 403 || forbidClaims.status !== 403 || forbidClaimAction.status !== 403) {
      throw new Error('Role authorization failed: donor accessed NGO endpoint without 403');
    }
    console.log('  Result: ✅ PASS\n');

    console.log('====================================================');
    console.log('   ALL 12 DAY 7 TEST SUITES PASSED SUCCESSFULLY!    ');
    console.log('====================================================\n');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runDay7Tests().catch((err) => {
  console.error('\n❌ Day 7 test execution failed:', err);
  process.exit(1);
});
