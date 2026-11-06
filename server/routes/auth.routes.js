import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Authentication Routes
// ---------------------------------------------------------------------------

// Public routes: authLimiter runs before validation to protect against brute-force
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

// Protected routes: requires a valid JWT Bearer token
router.get('/me', protect, getMe);

export default router;

