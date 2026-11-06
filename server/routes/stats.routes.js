import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';

const router = Router();

// Public endpoint: returns anonymous aggregate platform metrics for landing page counter
router.get('/', getStats);

export default router;
