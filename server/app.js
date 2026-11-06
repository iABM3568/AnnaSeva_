import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/error.js';

// Create the Express application
const app = express();

// ---------------------------------------------------------------------------
// 1. TRUST PROXY CONFIGURATION
// ---------------------------------------------------------------------------
// On cloud platforms (Render, Vercel, reverse proxies), requests pass through
// proxy load balancers. Setting 'trust proxy' to 1 informs Express to trust
// the first proxy hop in the X-Forwarded-For header so req.ip reflects the
// real client IP rather than the proxy's IP.
app.set('trust proxy', 1);

// ---------------------------------------------------------------------------
// 2. SECURITY HEADERS (Helmet)
// ---------------------------------------------------------------------------
// Sets standard HTTP security headers (nosniff, frameguard, etc.) and
// removes the X-Powered-By header to prevent fingerprinting.
app.use(helmet());

// ---------------------------------------------------------------------------
// 3. CORS CONFIGURATION
// ---------------------------------------------------------------------------
// Restricts browser requests strictly to the configured CLIENT_URL origin.
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
      // Allow non-browser callers (Thunder Client, curl, automated test suites) or matching client origin
      if (!origin || origin === allowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// 4. BODY PARSER (10 KB Limit)
// ---------------------------------------------------------------------------
// Rejects oversized request payloads with HTTP 413 to prevent memory-exhaustion attacks.
app.use(express.json({ limit: '10kb' }));

// ---------------------------------------------------------------------------
// 5. PUBLIC HEALTH CHECK (Pre-Limiter)
// ---------------------------------------------------------------------------
// Registered BEFORE the rate limiter so uptime monitors and orchestrator health
// probes are never blocked or throttled by rate limit budgets.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// 6. GENERAL API RATE LIMITING
// ---------------------------------------------------------------------------
// Protects downstream application routes from floods, scanning, and runaway loops.
app.use('/api', apiLimiter);

// ---------------------------------------------------------------------------
// 7. APPLICATION ROUTES
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/stats', statsRoutes);

// ---------------------------------------------------------------------------
// 8. ERROR HANDLING (Must Be Last)
// ---------------------------------------------------------------------------
// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
