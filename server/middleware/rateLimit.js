import rateLimit from 'express-rate-limit';

// Standard error payload returned with HTTP 429 (Too Many Requests)
const tooManyMessage = {
  message: 'Too many requests. Please wait a few minutes and try again.',
};

/**
 * General API Rate Limiter
 * - Window: 15 minutes
 * - Limit: 1000 requests per IP (overridable via RATE_LIMIT_MAX environment variable)
 * - Standard draft-6/draft-7 headers (RateLimit-*)
 * - Legacy headers disabled (X-RateLimit-*)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: Number(process.env.RATE_LIMIT_MAX) || 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: tooManyMessage,
});

/**
 * Authentication Rate Limiter (Brute-Force Protection)
 * - Window: 15 minutes
 * - Limit: 20 failed requests per IP
 * - skipSuccessfulRequests: true (Successful logins do NOT consume the rate limit budget)
 * - Standard draft-6/draft-7 headers
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: tooManyMessage,
});
