// ---------------------------------------------------------------------------
// Race Condition Test Script
// ---------------------------------------------------------------------------
// Fires 20 claim requests simultaneously at the EXACT SAME instant using Promise.all
// Usage: node scripts/race-test.js <listingId> <ngoToken>
// ---------------------------------------------------------------------------

const [listingId, token] = process.argv.slice(2);
const BASE = process.env.API_URL || 'http://localhost:5000/api';

if (!listingId || !token) {
  console.error('Usage: node scripts/race-test.js <listingId> <ngoToken>');
  process.exit(1);
}

console.log(`🚀 Starting race condition test against listing: ${listingId}`);
console.log('Fired 20 concurrent PATCH requests...');

// Dispatch 20 concurrent requests simultaneously
const requests = Array.from({ length: 20 }, () =>
  fetch(`${BASE}/listings/${listingId}/claim`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
);

// Await completion of all 20 concurrent requests
const responses = await Promise.all(requests);
const statuses = responses.map((r) => r.status);

// Aggregate response status frequency
const summary = statuses.reduce(
  (counts, s) => ({ ...counts, [s]: (counts[s] || 0) + 1 }),
  {}
);

console.log('Statuses received:', statuses.join(' '));
console.log('Summary breakdown:', summary);

if (summary[200] === 1 && (summary[409] || 0) === 19) {
  console.log('✅ PASS: Atomic operation guaranteed exactly ONE winner!');
} else {
  console.log(`⚠️ RESULT: ${summary[200] || 0} claims succeeded!`);
}

