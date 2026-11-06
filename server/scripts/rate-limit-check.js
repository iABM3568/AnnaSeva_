import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE = process.env.API_URL || 'http://localhost:5000/api';

// SAFETY GUARD: Never execute rate limit stress test against production
if (BASE.includes('onrender.com') && !process.env.FORCE_PROD_TEST) {
  console.error('❌ SAFETY ABORT: Refusing to run rate limit check against production URL.');
  console.error('Running this against production would lock your IP out of login for 15 minutes.');
  process.exit(1);
}

console.log(`Testing auth rate limiter against: ${BASE}/auth/login`);
console.log('Sending 25 invalid login attempts in sequence...\n');

const codes = [];
for (let attempt = 1; attempt <= 25; attempt++) {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody@example.com',
        password: 'wrong-password-test',
      }),
    });
    codes.push(res.status);
  } catch (err) {
    console.error(`Attempt ${attempt} network error:`, err.message);
    codes.push('ERR');
  }
}

console.log('HTTP Status Codes:');
console.log(codes.join(' '));

const fourOhOnes = codes.filter((c) => c === 401).length;
const fourTwentyNines = codes.filter((c) => c === 429).length;

console.log(`\nSummary: ${fourOhOnes} x HTTP 401 Unauthorized, ${fourTwentyNines} x HTTP 429 Too Many Requests`);

if (fourTwentyNines > 0) {
  console.log('✅ Rate limiter verified: Excessive failed logins throttled with HTTP 429.');
} else {
  console.log('⚠️ Note: No 429 observed (check if server was running or if limit was not exceeded).');
}
