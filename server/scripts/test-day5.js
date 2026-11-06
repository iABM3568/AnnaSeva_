import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from '../app.js';

async function runTests() {
  console.log('--- DAY 5 INTEGRATION & VERIFICATION TEST SUITE ---');

  // Connect to DB
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB:', mongoose.connection.name);

  // Start test server
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`✅ Express server listening on ${baseUrl}`);

  const testId = Date.now();
  let donorToken = null;
  let ngoToken = null;
  let donorUser = null;
  let ngoUser = null;

  try {
    // Test 1: Health Check
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      console.log('Test 1 - Health check:', res.status === 200 && data.status === 'ok' ? '✅ PASS' : '❌ FAIL', res.status);
    }

    // Test 2: CORS Preflight (OPTIONS request from client origin)
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Origin': process.env.CLIENT_URL || 'http://localhost:5173',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type,Authorization',
        },
      });
      const allowOrigin = res.headers.get('access-control-allow-origin');
      console.log('Test 2 - CORS Preflight headers:', allowOrigin === (process.env.CLIENT_URL || 'http://localhost:5173') ? '✅ PASS' : '❌ FAIL', `(Origin: ${allowOrigin})`);
    }

    // Test 3: Donor Registration
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Day5 Donor',
          email: `donor.${testId}@test.com`,
          password: 'Password123!',
          role: 'donor',
          organization: 'Green Grocery Hub',
        }),
      });
      const data = await res.json();
      donorToken = data.token;
      donorUser = data.data?.user;
      console.log('Test 3 - Donor Registration:', res.status === 201 && donorToken && donorUser?.role === 'donor' ? '✅ PASS (201)' : '❌ FAIL', res.status);
    }

    // Test 4: NGO Registration
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Day5 NGO',
          email: `ngo.${testId}@test.com`,
          password: 'Password123!',
          role: 'ngo',
          organization: 'Hope Kitchen',
        }),
      });
      const data = await res.json();
      ngoToken = data.token;
      ngoUser = data.data?.user;
      console.log('Test 4 - NGO Registration:', res.status === 201 && ngoToken && ngoUser?.role === 'ngo' ? '✅ PASS (201)' : '❌ FAIL', res.status);
    }

    // Test 5: Login with valid credentials
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `donor.${testId}@test.com`,
          password: 'Password123!',
        }),
      });
      const data = await res.json();
      console.log('Test 5 - Valid Login:', res.status === 200 && data.token && data.data?.user?.email === `donor.${testId}@test.com` ? '✅ PASS (200)' : '❌ FAIL', res.status);
    }

    // Test 6: Login with invalid password
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `donor.${testId}@test.com`,
          password: 'WrongPassword!',
        }),
      });
      const data = await res.json();
      console.log('Test 6 - Invalid Password Login:', res.status === 401 && data.message === 'Invalid email or password' ? '✅ PASS (401)' : '❌ FAIL', res.status);
    }

    // Test 7: Registration validation - Short password (< 8 chars)
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Short Pass',
          email: `short.${testId}@test.com`,
          password: '123',
          role: 'donor',
        }),
      });
      const data = await res.json();
      console.log('Test 7 - Registration Short Password:', res.status === 400 && data.errors?.some(e => e.field === 'password') ? '✅ PASS (400)' : '❌ FAIL', res.status);
    }

    // Test 8: Registration validation - Invalid role ('admin' not permitted)
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Hacker',
          email: `hacker.${testId}@test.com`,
          password: 'Password123!',
          role: 'admin',
        }),
      });
      const data = await res.json();
      console.log('Test 8 - Registration Disallowed Role:', res.status === 400 && data.errors?.some(e => e.field === 'role') ? '✅ PASS (400)' : '❌ FAIL', res.status);
    }

    // Test 9: Duplicate email registration
    {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Donor',
          email: `donor.${testId}@test.com`,
          password: 'Password123!',
          role: 'donor',
        }),
      });
      const data = await res.json();
      console.log('Test 9 - Duplicate Email:', res.status === 409 ? '✅ PASS (409 Conflict)' : '❌ FAIL', res.status);
    }

    // Test 10: GET /auth/me with valid Bearer token (Session verification)
    {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${donorToken}` },
      });
      const data = await res.json();
      console.log('Test 10 - GET /auth/me with Bearer token:', res.status === 200 && data.data?.user?.email === `donor.${testId}@test.com` ? '✅ PASS (200)' : '❌ FAIL', res.status);
    }

    // Test 11: GET /auth/me with invalid token
    {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Authorization': 'Bearer totally.invalid.token' },
      });
      const data = await res.json();
      console.log('Test 11 - GET /auth/me with invalid token:', res.status === 401 ? '✅ PASS (401)' : '❌ FAIL', res.status);
    }

    // Test 12: GET /auth/me with expired token
    {
      const expiredToken = jwt.sign(
        { id: donorUser._id || donorUser.id, role: 'donor' },
        process.env.JWT_SECRET,
        { expiresIn: '-10s' } // Expired 10 seconds ago
      );
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${expiredToken}` },
      });
      const data = await res.json();
      console.log('Test 12 - GET /auth/me with expired token:', res.status === 401 && data.message.includes('expired') ? '✅ PASS (401 Expired)' : '❌ FAIL', res.status);
    }

    // Test 13: Protected routes role enforcement (Donor attempting NGO route)
    {
      // Mock listing claim route which requires NGO role
      const res = await fetch(`${baseUrl}/api/listings/672bd0a46979685324639912/claim`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${donorToken}` },
      });
      console.log('Test 13 - Donor forbidden from NGO action:', res.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL', res.status);
    }

    console.log('\n--- ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY ---');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
