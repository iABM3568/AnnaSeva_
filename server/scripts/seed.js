import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Center coordinates for demo listings (Pune city center)
const CENTER = { lat: 18.5204, lng: 73.8567 };
const MAX_KM = 8; // Spread listings within an 8 km radius
const COUNT = Number(process.argv.find((a) => /^\d+$/.test(a))) || 15;
const FORCE = process.argv.includes('--force');
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Demo@12345';

const DEMO_USERS = [
  {
    name: 'Demo Donor',
    email: 'donor.demo@example.com',
    role: 'donor',
    organization: 'Spice Garden Restaurant',
  },
  {
    name: 'Demo NGO',
    email: 'ngo.demo@example.com',
    role: 'ngo',
    organization: 'Helping Hands Trust',
  },
];

const FOOD_ITEMS = [
  { title: 'Vegetable Biryani with Raita', foodType: 'veg' },
  { title: 'Dal Makhani & Steamed Rice', foodType: 'veg' },
  { title: 'Roti, Chapati & Mixed Sabzi', foodType: 'veg' },
  { title: 'Chicken Curry & Jeera Rice', foodType: 'non-veg' },
  { title: 'Sandwich & Finger Food Platter', foodType: 'veg' },
  { title: 'Fresh Seasonal Fruit Salad', foodType: 'vegan' },
  { title: 'Assorted Banquet Buffet Surplus', foodType: 'mixed' },
  { title: 'Idli, Medu Vada & Sambar', foodType: 'veg' },
  { title: 'Paneer Butter Masala with Parathas', foodType: 'veg' },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random point uniformly distributed in a circle of radius maxKm
function randomPointNear(center, maxKm) {
  const distanceKm = maxKm * Math.sqrt(Math.random());
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (distanceKm * Math.sin(angle)) / 111;
  const dLng = (distanceKm * Math.cos(angle)) / (111 * Math.cos((center.lat * Math.PI) / 180));
  return [Number((center.lng + dLng).toFixed(4)), Number((center.lat + dLat).toFixed(4))]; // [LONGITUDE, LATITUDE]
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const dbName = mongoose.connection.name;
  console.log(`Connected to database: ${dbName}`);

  // Safety net: Only run on _dev databases unless explicitly forced
  if (!dbName.endsWith('_dev') && !FORCE) {
    console.error('Refusing to seed a non-dev database. Re-run with --force if you really mean it.');
    process.exit(1);
  }

  // Find or create demo accounts
  const users = {};
  for (const u of DEMO_USERS) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      user = await User.create({ ...u, password: DEMO_PASSWORD });
    }
    users[u.role] = user;
  }

  // Remove existing demo listings
  await Listing.deleteMany({ donor: users.donor._id });

  const now = Date.now();
  const listings = Array.from({ length: COUNT }, (_, i) => {
    const food = pick(FOOD_ITEMS);
    return {
      title: `${food.title} (Batch #${i + 1})`,
      description: 'Freshly packed surplus food from today catering. Please bring clean containers.',
      foodType: food.foodType,
      quantity: 10 + Math.floor(Math.random() * 50),
      preparedAt: new Date(now - 45 * 60 * 1000), // Cooked 45 mins ago
      expiresAt: new Date(now + (2 + Math.random() * 4) * 3600 * 1000), // Expires in 2-6 hours
      pickupAddress: `Demo Food Counter #${i + 1}, Pune Junction Road`,
      location: {
        type: 'Point',
        coordinates: randomPointNear(CENTER, MAX_KM), // [lng, lat]
      },
      donor: users.donor._id,
      status: 'available',
    };
  });

  await Listing.insertMany(listings);
  console.log(`✅ Successfully seeded ${COUNT} listings into ${dbName}.`);
  console.log('\n--- DEMO ACCOUNTS CREATED ---');
  console.log(`Donor: donor.demo@example.com  (Password: ${DEMO_PASSWORD})`);
  console.log(`NGO:   ngo.demo@example.com    (Password: ${DEMO_PASSWORD})`);
  console.log('-----------------------------\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

