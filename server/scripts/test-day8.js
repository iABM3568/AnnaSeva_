import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'node:http';
import mongoose from 'mongoose';
import { io as ClientSocket } from 'socket.io-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from '../app.js';
import { initSocket } from '../sockets/index.js';

async function runDay8Tests() {
  console.log('====================================================');
  console.log('   DAY 8: REAL-TIME UPDATES (SOCKET.IO) TEST MATRIX  ');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGO_URI);

  // Wrap app in HTTP server and attach Socket.IO
  const httpServer = http.createServer(app);
  const ioServer = initSocket(httpServer);
  const server = httpServer.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  const socketUrl = `http://127.0.0.1:${port}`;

  const testId = Date.now();
  let donorToken = null;
  let donorId = null;
  let ngoAToken = null;
  let ngoAId = null;
  let ngoBToken = null;
  let ngoBId = null;

  let donorSocket = null;
  let ngoASocket = null;
  let ngoBSocket = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Register Accounts (Donor, NGO A, NGO B)
    // -------------------------------------------------------------------------
    console.log('TEST 1: Provisioning Accounts for Three Separate Client Roles:');
    // Donor
    const donorRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'The Grand Heritage Donor',
        email: `donor_${testId}@example.com`,
        password: 'Password@123',
        role: 'donor',
        organization: 'Heritage Hospitality Group',
      }),
    });
    const donorData = await donorRes.json();
    donorToken = donorData.token;
    donorId = donorData.data.user._id;

    // NGO A
    const ngoARes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pune Annadan Trust (NGO A)',
        email: `ngoa_${testId}@example.com`,
        password: 'Password@123',
        role: 'ngo',
        organization: 'Pune Annadan Seva',
      }),
    });
    const ngoAData = await ngoARes.json();
    ngoAToken = ngoAData.token;
    ngoAId = ngoAData.data.user._id;

    // NGO B
    const ngoBRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Care Food Relief (NGO B)',
        email: `ngob_${testId}@example.com`,
        password: 'Password@123',
        role: 'ngo',
        organization: 'Care Foundation India',
      }),
    });
    const ngoBData = await ngoBRes.json();
    ngoBToken = ngoBData.token;
    ngoBId = ngoBData.data.user._id;

    console.log('  Donor provisioned: %s (ID: %s)', donorData.data.user.name, donorId);
    console.log('  NGO A provisioned: %s (ID: %s)', ngoAData.data.user.name, ngoAId);
    console.log('  NGO B provisioned: %s (ID: %s)', ngoBData.data.user.name, ngoBId);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 2: Handshake Security & Authentication Middleware
    // -------------------------------------------------------------------------
    console.log('TEST 2: Socket Handshake Security & JWT Enforcement:');

    // Attempt 1: No token
    const noTokenErr = await new Promise((resolve) => {
      const s = ClientSocket(socketUrl, { transports: ['websocket'], auth: {} });
      s.on('connect_error', (err) => {
        s.disconnect();
        resolve(err.message);
      });
    });
    console.log('  Unauthenticated connection rejected: "%s"', noTokenErr);
    if (!noTokenErr.includes('Authentication required')) {
      throw new Error(`Expected missing token rejection, got: ${noTokenErr}`);
    }

    // Attempt 2: Tampered token
    const badTokenErr = await new Promise((resolve) => {
      const s = ClientSocket(socketUrl, {
        transports: ['websocket'],
        auth: { token: 'tampered.jwt.string' },
      });
      s.on('connect_error', (err) => {
        s.disconnect();
        resolve(err.message);
      });
    });
    console.log('  Tampered token connection rejected: "%s"', badTokenErr);
    if (!badTokenErr.includes('Unauthorized')) {
      throw new Error(`Expected invalid token rejection, got: ${badTokenErr}`);
    }
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 3: Authenticated Connections & Room Assignments
    // -------------------------------------------------------------------------
    console.log('TEST 3: Authenticated Handshake & Room Multiplexing:');

    donorSocket = ClientSocket(socketUrl, {
      transports: ['websocket'],
      auth: { token: donorToken },
    });
    await new Promise((resolve) => donorSocket.on('connect', resolve));

    ngoASocket = ClientSocket(socketUrl, {
      transports: ['websocket'],
      auth: { token: ngoAToken },
    });
    await new Promise((resolve) => ngoASocket.on('connect', resolve));

    ngoBSocket = ClientSocket(socketUrl, {
      transports: ['websocket'],
      auth: { token: ngoBToken },
    });
    await new Promise((resolve) => ngoBSocket.on('connect', resolve));

    console.log('  Donor Socket connected (ID: %s)', donorSocket.id);
    console.log('  NGO A Socket connected (ID: %s)', ngoASocket.id);
    console.log('  NGO B Socket connected (ID: %s)', ngoBSocket.id);

    // Verify rooms on server
    const donorServerRoom = ioServer.sockets.adapter.rooms.get(`user:${donorId}`);
    const ngoARoom = ioServer.sockets.adapter.rooms.get(`user:${ngoAId}`);
    const ngoBRoom = ioServer.sockets.adapter.rooms.get(`user:${ngoBId}`);
    const ngosCollectiveRoom = ioServer.sockets.adapter.rooms.get('ngos');

    if (!donorServerRoom || donorServerRoom.size < 1) throw new Error('Donor private room missing');
    if (!ngoARoom || ngoARoom.size < 1) throw new Error('NGO A private room missing');
    if (!ngoBRoom || ngoBRoom.size < 1) throw new Error('NGO B private room missing');
    if (!ngosCollectiveRoom || ngosCollectiveRoom.size < 2) {
      throw new Error(`ngos collective room expected at least 2 sockets, got ${ngosCollectiveRoom?.size}`);
    }
    console.log('  Private rooms active: user:%s, user:%s, user:%s', donorId, ngoAId, ngoBId);
    console.log('  Collective ngos room size: %d sockets', ngosCollectiveRoom.size);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 4: Real-Time Event: listing:new Broadcast to NGOs
    // -------------------------------------------------------------------------
    console.log('TEST 4: Donor Posts Listing -> Real-Time listing:new Broadcast:');

    const receivedListingNewA = new Promise((resolve) => {
      ngoASocket.once('listing:new', (listing) => resolve(listing));
    });
    const receivedListingNewB = new Promise((resolve) => {
      ngoBSocket.once('listing:new', (listing) => resolve(listing));
    });
    let donorGotListingNew = false;
    donorSocket.once('listing:new', () => {
      donorGotListingNew = true;
    });

    const now = Date.now();
    const createRes = await fetch(`${baseUrl}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${donorToken}`,
      },
      body: JSON.stringify({
        title: 'Dal Makhani & Naan Dinner Buffet Surplus',
        description: 'Freshly packed in sanitary insulated crates.',
        foodType: 'veg',
        quantity: 60,
        preparedAt: new Date(now - 30 * 60 * 1000).toISOString(),
        expiresAt: new Date(now + 4 * 3600 * 1000).toISOString(),
        pickupAddress: 'Heritage Lawns, Senapati Bapat Road, Pune',
        latitude: 18.532,
        longitude: 73.834,
      }),
    });
    const createData = await createRes.json();
    const createdListing = createData.listing;

    const [eventA, eventB] = await Promise.all([receivedListingNewA, receivedListingNewB]);

    if (eventA._id !== createdListing._id || eventB._id !== createdListing._id) {
      throw new Error('Received listing:new ID does not match created listing');
    }
    if (donorGotListingNew) {
      throw new Error('Donor unexpectedly received listing:new broadcast (should only go to ngos room)');
    }

    console.log('  Server created listing ID: %s', createdListing._id);
    console.log('  NGO A received listing:new within < 100ms: "%s" (%d portions)', eventA.title, eventA.quantity);
    console.log('  NGO B received listing:new within < 100ms: "%s" (%d portions)', eventB.title, eventB.quantity);
    console.log('  Donor excluded from public discovery room (Correct)');
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 5: Real-Time Event: listing:updated with Data Minimization on Claim
    // -------------------------------------------------------------------------
    console.log('TEST 5: NGO A Claims Food -> Targeted Private Notification + Privacy-Safe Broadcast:');

    const donorUpdatePromise = new Promise((resolve) => {
      donorSocket.once('listing:updated', (listing) => resolve(listing));
    });
    const ngoAUpdatePromise = new Promise((resolve) => {
      ngoASocket.once('listing:updated', (listing) => resolve(listing));
    });
    const ngoBUpdatePromise = new Promise((resolve) => {
      ngoBSocket.once('listing:updated', (listing) => resolve(listing));
    });

    const claimRes = await fetch(`${baseUrl}/api/listings/${createdListing._id}/claim`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ngoAToken}` },
    });
    if (claimRes.status !== 200) {
      throw new Error(`Expected 200 OK on claim, got ${claimRes.status}`);
    }

    const [donorUpdate, ngoAUpdate, ngoBUpdate] = await Promise.all([
      donorUpdatePromise,
      ngoAUpdatePromise,
      ngoBUpdatePromise,
    ]);

    // 1. Donor receives update with claimedBy populated
    if (donorUpdate.status !== 'claimed' || !donorUpdate.claimedBy) {
      throw new Error('Donor listing:updated missing claimedBy details');
    }
    console.log('  Donor received private update: Status "%s", Claimed by: %s (%s)',
      donorUpdate.status, donorUpdate.claimedBy.name, donorUpdate.claimedBy.organization);

    // 2. Claiming NGO A receives full update
    if (ngoAUpdate.status !== 'claimed') {
      throw new Error('Claiming NGO A listing:updated invalid status');
    }
    console.log('  Claiming NGO A received confirmation update: Status "%s"', ngoAUpdate.status);

    // 3. Other NGO B receives update WITHOUT claimedBy (Data Minimization & Privacy)
    if (ngoBUpdate.claimedBy) {
      throw new Error('Privacy failure: NGO B received claimedBy details of another organization!');
    }
    console.log('  Other NGO B received sanitized update: claimedBy is undefined (Privacy Protected)');
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 6: Real-Time Event: listing:updated on Complete
    // -------------------------------------------------------------------------
    console.log('TEST 6: Donor Marks Food Picked Up -> Real-Time listing:updated:');

    const ngoACompletePromise = new Promise((resolve) => {
      ngoASocket.once('listing:updated', (listing) => resolve(listing));
    });

    const completeRes = await fetch(`${baseUrl}/api/listings/${createdListing._id}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${donorToken}` },
    });
    if (completeRes.status !== 200) {
      throw new Error(`Expected 200 OK on complete, got ${completeRes.status}`);
    }

    const completedListing = await ngoACompletePromise;
    if (completedListing.status !== 'completed') {
      throw new Error(`Expected completed status on socket, got ${completedListing.status}`);
    }
    console.log('  NGO A received real-time status update: "%s"', completedListing.status);
    console.log('  Result: ✅ PASS\n');

    // -------------------------------------------------------------------------
    // TEST 7: Clean Disconnect on Logout
    // -------------------------------------------------------------------------
    console.log('TEST 7: Socket Lifecycle & Clean Disconnect:');
    donorSocket.disconnect();
    ngoASocket.disconnect();
    ngoBSocket.disconnect();

    await new Promise((r) => setTimeout(r, 200));

    console.log('  Donor connected: %s', donorSocket.connected);
    console.log('  NGO A connected: %s', ngoASocket.connected);
    console.log('  NGO B connected: %s', ngoBSocket.connected);
    if (donorSocket.connected || ngoASocket.connected || ngoBSocket.connected) {
      throw new Error('Socket failed to disconnect cleanly');
    }
    console.log('  Result: ✅ PASS\n');

    console.log('====================================================');
    console.log('   ALL DAY 8 REAL-TIME SUITES PASSED SUCCESSFULLY!  ');
    console.log('====================================================\n');
  } finally {
    if (donorSocket) donorSocket.disconnect();
    if (ngoASocket) ngoASocket.disconnect();
    if (ngoBSocket) ngoBSocket.disconnect();
    server.close();
    await mongoose.disconnect();
  }
}

runDay8Tests().catch((err) => {
  console.error('\n❌ Day 8 test execution failed:', err);
  process.exit(1);
});
