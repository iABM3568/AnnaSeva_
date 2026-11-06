import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the connection string stored in MONGO_URI.
 * If the connection fails, logs the error and exits the Node process.
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If the database cannot be reached, the server cannot fulfill its business duties.
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // 1 means exit process with failure
  }
}

