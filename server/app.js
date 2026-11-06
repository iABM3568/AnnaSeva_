import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

// Create the Express application
const app = express();

// ---------------------------------------------------------------------------
// GLOBAL MIDDLEWARE
// ---------------------------------------------------------------------------
// 1. CORS: allow requests from specified frontend client origin
app.use(cors({ origin: process.env.CLIENT_URL }));

// 2. Body Parser: parses incoming JSON bodies and attaches to req.body
app.use(express.json());

// ---------------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------------
// Health check endpoint (Preserved from Day 1)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// Authentication and Authorization Routes (Day 2)
app.use('/api/auth', authRoutes);

// Food Listings and Geospatial Routes (Day 3)
app.use('/api/listings', listingRoutes);

// ---------------------------------------------------------------------------
// ERROR HANDLING MIDDLEWARE
// ---------------------------------------------------------------------------
// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler (must be last middleware)
app.use(errorHandler);

// Export the configured application for server.js and testing
export default app;
