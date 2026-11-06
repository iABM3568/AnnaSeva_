import express from 'express';
import cors from 'cors';

// Create the Express application
const app = express();

// MIDDLEWARE: functions that run on incoming requests before reaching route handlers.
// 1. CORS: allow requests from our specified frontend client URL.
app.use(cors({ origin: process.env.CLIENT_URL }));

// 2. Body Parser: parses incoming JSON payloads and attaches them to req.body.
app.use(express.json());

// ROUTE: Health check endpoint
// Used by developers, uptime monitors, and cloud platforms to verify server responsiveness.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

// Export the configured application for server.js (and future test runners)
export default app;

