import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Authentication Routes
// ---------------------------------------------------------------------------

// Public routes: anyone can attempt to register or login
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes: requires a valid JWT Bearer token
router.get('/me', protect, getMe);

export default router;

