import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_EMAILS = ['donor.demo@example.com', 'ngo.demo@example.com'];
const FORCE = process.argv.includes('--force');

async function cleanup() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is missing.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const dbName = mongoose.connection.name;
  console.log(`Connected to database: ${dbName}`);

  // Safety net: refuse to run on a non-dev database without explicit --force confirmation
  if (!dbName.endsWith('_dev') && !FORCE) {
    console.error('❌ Refusing to clean up a non-dev database. Re-run with --force if you really mean it.');
    process.exit(1);
  }

  // Find demo users first so we know their ObjectIDs
  const demoUsers = await User.find({ email: { $in: DEMO_EMAILS } }).select('_id email');
  const demoIds = demoUsers.map((user) => user._id);

  if (demoIds.length === 0) {
    console.log('ℹ️ No demo accounts found to clean up.');
    await mongoose.disconnect();
    return;
  }

  // Delete listings posted OR claimed by demo users, then delete demo users
  const listingResult = await Listing.deleteMany({
    $or: [{ donor: { $in: demoIds } }, { claimedBy: { $in: demoIds } }],
  });
  const userResult = await User.deleteMany({ _id: { $in: demoIds } });

  console.log(`✅ Cleanup complete: Deleted ${listingResult.deletedCount} demo listings and ${userResult.deletedCount} demo users.`);
  await mongoose.disconnect();
}

cleanup().catch((err) => {
  console.error('❌ Error during demo cleanup:', err);
  process.exit(1);
});
