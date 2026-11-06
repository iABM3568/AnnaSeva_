import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE = process.env.API_URL || 'http://localhost:5000/api';

async function runRaceVerification() {
  console.log('====================================================');
  console.log('   DAY 9: 20-REQUEST ATOMIC RACE CONDITION TEST     ');
  console.log('====================================================\n');

  const testId = Date.now();

  // 1. Create temporary donor
  const donorRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Race Test Donor',
      email: `racedonor_${testId}@example.com`,
      password: 'Password@123',
      role: 'donor',
      organization: 'Race Catering Co',
    }),
  });
  const donorData = await donorRes.json();
  const donorToken = donorData.token;

  // 2. Create temporary NGO
  const ngoRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Race Test NGO',
      email: `racengo_${testId}@example.com`,
      password: 'Password@123',
      role: 'ngo',
      organization: 'Race Relief NGO',
    }),
  });
  const ngoData = await ngoRes.json();
  const ngoToken = ngoData.token;

  // 3. Post an available listing
  const now = Date.now();
  const listingRes = await fetch(`${BASE}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${donorToken}`,
    },
    body: JSON.stringify({
      title: 'High Concurrency Buffet Surplus',
      foodType: 'veg',
      quantity: 50,
      preparedAt: new Date(now - 30 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 4 * 3600 * 1000).toISOString(),
      pickupAddress: 'Testing Grounds, Pune',
      latitude: 18.5204,
      longitude: 73.8567,
    }),
  });
  const listingData = await listingRes.json();
  const listingId = listingData.listing._id;

  console.log(`Created test listing ID: ${listingId}`);
  console.log('Firing 20 concurrent claim requests simultaneously via Promise.all...\n');

  // 4. Fire 20 simultaneous claim requests
  const requests = Array.from({ length: 20 }, () =>
    fetch(`${BASE}/listings/${listingId}/claim`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${ngoToken}`,
        'Content-Type': 'application/json',
      },
    })
  );

  const responses = await Promise.all(requests);
  const statuses = responses.map((r) => r.status);
  const summary = statuses.reduce(
    (acc, s) => ({ ...acc, [s]: (acc[s] || 0) + 1 }),
    {}
  );

  console.log('Statuses received:', statuses.join(' '));
  console.log('Summary breakdown:', summary);

  if (summary[200] === 1 && summary[409] === 19) {
    console.log('\n✅ PASS: Exactly 1 HTTP 200 Winner and 19 HTTP 409 Conflicts verified!');
  } else {
    console.error(`\n❌ FAIL: Expected 1 200 and 19 409s, got ${JSON.stringify(summary)}`);
    process.exit(1);
  }
}

runRaceVerification().catch((err) => {
  console.error('Race test failed:', err);
  process.exit(1);
});
