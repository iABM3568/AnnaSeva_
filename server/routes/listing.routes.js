import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { validateId } from '../middleware/validateId.js';
import { createListingSchema, nearbySchema } from '../validators/listing.schema.js';
import {
  createListing,
  getMyListings,
  getNearby,
  getMyClaims,
  claimListing,
  completeListing,
  cancelListing,
} from '../controllers/listing.controller.js';

const router = Router();

// ---------------------------------------------------------------------------
// All listing endpoints require an active, verified user session
// ---------------------------------------------------------------------------
router.use(protect);

// ---------------------------------------------------------------------------
// Donor Routes
// ---------------------------------------------------------------------------
// POST /api/listings — Create a new surplus food listing
router.post(
  '/',
  restrictTo('donor'),
  validate(createListingSchema),
  createListing
);

// GET /api/listings/mine — View all listings posted by the logged-in donor
router.get(
  '/mine',
  restrictTo('donor'),
  getMyListings
);

// PATCH /api/listings/:id/complete — Donor marks claimed food as picked up
router.patch(
  '/:id/complete',
  restrictTo('donor'),
  validateId,
  completeListing
);

// PATCH /api/listings/:id/cancel — Donor cancels an available or claimed listing
router.patch(
  '/:id/cancel',
  restrictTo('donor'),
  validateId,
  cancelListing
);

// ---------------------------------------------------------------------------
// NGO Routes
// ---------------------------------------------------------------------------
// GET /api/listings/nearby?lat=...&lng=...&radiusKm=... — Search nearby available food
router.get(
  '/nearby',
  restrictTo('ngo'),
  validate(nearbySchema, 'query'),
  getNearby
);

// GET /api/listings/claimed — View listings claimed by the logged-in NGO
router.get(
  '/claimed',
  restrictTo('ngo'),
  getMyClaims
);

// PATCH /api/listings/:id/claim — Atomically claim an available listing
router.patch(
  '/:id/claim',
  restrictTo('ngo'),
  validateId,
  claimListing
);

export default router;
