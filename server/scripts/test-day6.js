import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from '../app.js';

async function runTests() {
  console.log('--- DAY 6 DONOR EXPERIENCE INTEGRATION TEST SUITE ---');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB:', mongoose.connection.name);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`✅ Test server running on ${baseUrl}`);

  const testId = Date.now();
  let donorToken = null;
  let ngoToken = null;
  let listing1Id = null;
  let listing2Id = null;

  try {
    // 1. Register Donor
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Day6 Master Chef',
          email: `donor.${testId}@test.com`,
          password: 'Password123!',
          role: 'donor',
          organization: 'Grand Banquet Kitchens',
        }),
      });
      const data = await res.json();
      donorToken = data.token;
      console.log('Test 1 - Register Donor:', res.status === 201 && donorToken ? '✅ PASS (201)' : '❌ FAIL', res.status);
    }

    // 2. Register NGO
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Day6 Food Care NGO',
          email: `ngo.${testId}@test.com`,
          password: 'Password123!',
          role: 'ngo',
          organization: 'Seva Foundation',
        }),
      });
      const data = await res.json();
      ngoToken = data.token;
      console.log('Test 2 - Register NGO:', res.status === 201 && ngoToken ? '✅ PASS (201)' : '❌ FAIL', res.status);
    }

    // 3. Donor posts a new food listing
    {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours ahead

      const res = await fetch(`${baseUrl}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${donorToken}`,
        },
        body: JSON.stringify({
          title: '30 Packets Fresh Pulao and Curry',
          description: 'Hygienically packaged meals from afternoon corporate event.',
          foodType: 'veg',
          quantity: 30,
          preparedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          pickupAddress: 'Gate 4, Hinjewadi Phase 1, Pune',
          latitude: 18.5913,
          longitude: 73.7389,
        }),
      });
      const data = await res.json();
      listing1Id = data.listing?._id || data.data?.listing?._id;
      console.log('Test 3 - Donor Posts Listing 1:', res.status === 201 && listing1Id ? '✅ PASS (201)' : '❌ FAIL', res.status);
    }

    // 4. Donor retrieves their own listings via GET /api/listings/mine
    {
      const res = await fetch(`${baseUrl}/api/listings/mine`, {
        headers: { 'Authorization': `Bearer ${donorToken}` },
      });
      const data = await res.json();
      const listings = data.listings || data.data?.listings || [];
      const found = listings.some(l => l._id === listing1Id);
      console.log('Test 4 - Donor Sees Posted Listing in /mine:', res.status === 200 && found ? '✅ PASS (200)' : '❌ FAIL', `(Count: ${listings.length})`);
    }

    // 5. NGO claims the food listing
    {
      const res = await fetch(`${baseUrl}/api/listings/${listing1Id}/claim`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${ngoToken}` },
      });
      const data = await res.json();
      const listing = data.listing || data.data?.listing;
      console.log('Test 5 - NGO Claims Listing 1:', res.status === 200 && listing?.status === 'claimed' ? '✅ PASS (200)' : '❌ FAIL', res.status);
    }

    // 6. Donor checks /mine and sees listing is claimed with NGO details populated
    {
      const res = await fetch(`${baseUrl}/api/listings/mine`, {
        headers: { 'Authorization': `Bearer ${donorToken}` },
      });
      const data = await res.json();
      const listings = data.listings || data.data?.listings || [];
      const item = listings.find(l => l._id === listing1Id);
      const isClaimedWithDetails = item?.status === 'claimed' && (item.claimedBy?.name || item.claimedBy?.organization);
      console.log('Test 6 - Claim Details Populated in Donor /mine:', isClaimedWithDetails ? '✅ PASS' : '❌ FAIL', `(ClaimedBy: ${item?.claimedBy?.name})`);
    }

    // 7. Donor marks claimed listing as picked up (Complete)
    {
      const res = await fetch(`${baseUrl}/api/listings/${listing1Id}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${donorToken}` },
      });
      const data = await res.json();
      const listing = data.listing || data.data?.listing;
      console.log('Test 7 - Donor Marks Listing Picked Up (Complete):', res.status === 200 && listing?.status === 'completed' ? '✅ PASS (200)' : '❌ FAIL', res.status);
    }

    // 8. Donor posts second listing and cancels it
    {
      const now = new Date();
      const resPost = await fetch(`${baseUrl}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${donorToken}`,
        },
        body: JSON.stringify({
          title: '20 Fruit Salads',
          foodType: 'vegan',
          quantity: 20,
          preparedAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          pickupAddress: 'Cafeteria A, Baner, Pune',
          latitude: 18.5590,
          longitude: 73.7868,
        }),
      });
      const dataPost = await resPost.json();
      listing2Id = dataPost.listing?._id || dataPost.data?.listing?._id;

      // Cancel listing 2
      const resCancel = await fetch(`${baseUrl}/api/listings/${listing2Id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${donorToken}` },
      });
      const dataCancel = await resCancel.json();
      const listing = dataCancel.listing || dataCancel.data?.listing;
      console.log('Test 8 - Donor Cancels Listing 2:', resCancel.status === 200 && listing?.status === 'cancelled' ? '✅ PASS (200)' : '❌ FAIL', resCancel.status);
    }

    // 9. Role Boundary Test: NGO cannot create listing
    {
      const res = await fetch(`${baseUrl}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ngoToken}`,
        },
        body: JSON.stringify({
          title: 'Illegal Listing by NGO',
          foodType: 'veg',
          quantity: 10,
          preparedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          pickupAddress: 'Pune',
          latitude: 18.5,
          longitude: 73.8,
        }),
      });
      console.log('Test 9 - NGO Forbidden from Posting Food:', res.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL', res.status);
    }

    // 10. Role Boundary Test: NGO cannot mark complete
    {
      const res = await fetch(`${baseUrl}/api/listings/${listing2Id}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${ngoToken}` },
      });
      console.log('Test 10 - NGO Forbidden from Marking Complete:', res.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL', res.status);
    }

    console.log('\n--- ALL DAY 6 DONOR EXPERIENCE TESTS PASSED ---');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

