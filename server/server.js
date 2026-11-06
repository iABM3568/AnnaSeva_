// This import MUST be first: it reads .env into process.env before any other module executes
import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

// Read port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas before accepting HTTP requests
await connectDB();

// Start listening for incoming connections
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

