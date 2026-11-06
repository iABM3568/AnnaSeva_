import 'dotenv/config';
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

// ---------------------------------------------------------------------------
// Lab 2: Index Performance & Query Plan Comparison
// ---------------------------------------------------------------------------
// Demonstrates how an index changes MongoDB's query execution from a slow
// Collection Scan (COLLSCAN) to an instantaneous Index Scan (IXSCAN).
// ---------------------------------------------------------------------------

async function runExplainLab() {
  await mongoose.connect(process.env.MONGO_URI);
  const dbName = mongoose.connection.name;
  console.log(`Connected to database: ${dbName}`);

  if (!dbName.endsWith('_dev')) {
    console.error('This lab only runs on a *_dev database.');
    process.exit(1);
  }

  const donor = await User.findOne({ email: 'donor.demo@example.com' });
  if (!donor) {
    console.error('Please run "node scripts/seed.js" first to create the demo donor account.');
    process.exit(1);
  }

  // Insert 3,000 noise listings from other donors to benchmark index performance safely on Atlas free tier
  const NOISE_COUNT = 3000;
  console.log(`\nInserting ${NOISE_COUNT} benchmark noise listings...`);
  const template = {
    title: '__noise_test__',
    foodType: 'veg',
    quantity: 1,
    pickupAddress: 'Noise Address',
    preparedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600 * 1000),
    location: { type: 'Point', coordinates: [73.85, 18.52] },
  };

  await Listing.insertMany(
    Array.from({ length: NOISE_COUNT }, () => ({
      ...template,
      donor: new mongoose.Types.ObjectId(), // Random non-matching donor IDs
    }))
  );
  console.log('Noise data loaded.');

  async function report(label) {
    const raw = await Listing.find({ donor: donor._id }).explain('executionStats');
    const result = Array.isArray(raw) ? raw[0] : raw;
    const stats = result.executionStats;
    const usedIndex = JSON.stringify(result.queryPlanner.winningPlan).includes('IXSCAN');

    console.log(`\n========================================`);
    console.log(`${label}`);
    console.log(`========================================`);
    console.log(`  Execution Plan:     ${usedIndex ? 'IXSCAN (Index Scan ✅)' : 'COLLSCAN (Full Collection Scan ⚠️)'}`);
    console.log(`  Documents Examined: ${stats.totalDocsExamined}`);
    console.log(`  Documents Returned: ${stats.nReturned}`);
    console.log(`  Execution Time:     ${stats.executionTimeMillis} ms`);
  }

  // 1. With Index
  await report('1. WITH the { donor: 1, createdAt: -1 } Index');

  // 2. Drop the index temporarily
  console.log('\nTemporarily dropping index "donor_1_createdAt_-1"...');
  await Listing.collection.dropIndex('donor_1_createdAt_-1');

  // 3. Without Index
  await report('2. WITHOUT the Index (Collection Scan)');

  // 4. Restore index and clean up
  console.log('\nRestoring indexes and removing benchmark noise data...');
  await Listing.syncIndexes();
  await Listing.deleteMany({ title: '__noise_test__' });
  console.log('✅ Cleanup complete. Indexes restored.');

  await mongoose.disconnect();
}

runExplainLab().catch((err) => {
  console.error('Explain lab error:', err);
  process.exit(1);
});

