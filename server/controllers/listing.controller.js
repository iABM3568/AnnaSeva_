import Listing from '../models/Listing.js';

// ---------------------------------------------------------------------------
// Helper: failTransition
// ---------------------------------------------------------------------------
// If a state transition query (findOneAndUpdate) returns null, this helper
// investigates WHY it failed:
//   - If the listing doesn't exist (scoped to permitted filters), return 404 Not Found.
//   - If the listing exists but is in an ineligible state (or expired), return 409 Conflict.
// This prevents existence leakage (IDOR) while giving callers clear error feedback.
// ---------------------------------------------------------------------------
async function failTransition(res, existsFilter, conflictMessage) {
  const exists = await Listing.exists(existsFilter);
  if (!exists) {
    return res.status(404).json({
      status: 'fail',
      message: 'Listing not found',
    });
  }
  return res.status(409).json({
    status: 'fail',
    message: conflictMessage,
  });
}

// ---------------------------------------------------------------------------
// 1. POST /api/listings — Create a Food Listing
// ---------------------------------------------------------------------------
// ROLE: Donor only
// INPUT: Validated data at req.valid (via createListingSchema)
// PREREQUISITES: protect, restrictTo('donor')
// ---------------------------------------------------------------------------
export async function createListing(req, res) {
  const { latitude, longitude, ...fields } = req.valid;

  const listing = await Listing.create({
    ...fields,
    donor: req.user.id,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude], // Longitude first!
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      listing,
    },
    listing,
  });
}

// ---------------------------------------------------------------------------
// 2. GET /api/listings/mine — Retrieve Donor's Own Listings
// ---------------------------------------------------------------------------
// ROLE: Donor only
// PREREQUISITES: protect, restrictTo('donor')
// ENFORCES: Resource-level authorization (IDOR protection)
// ---------------------------------------------------------------------------
export async function getMyListings(req, res) {
  const listings = await Listing.find({ donor: req.user.id })
    .sort({ createdAt: -1 })
    .populate('claimedBy', 'name organization email');

  res.status(200).json({
    status: 'success',
    count: listings.length,
    data: {
      listings,
    },
    listings,
  });
}

// ---------------------------------------------------------------------------
// 3. GET /api/listings/nearby — Geospatial Nearby Food Search
// ---------------------------------------------------------------------------
// ROLE: NGO only
// QUERY PARAMS: ?lat=18.5204&lng=73.8567&radiusKm=5
// PREREQUISITES: protect, restrictTo('ngo'), validate(nearbySchema, 'query')
// ---------------------------------------------------------------------------
export async function getNearby(req, res) {
  const { lat, lng, radiusKm } = req.valid;

  const listings = await Listing.find({
    status: 'available',
    expiresAt: { $gt: new Date() },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: radiusKm * 1000,
      },
    },
  })
    .limit(50)
    .populate('donor', 'name organization pickupAddress')
    .lean();

  res.status(200).json({
    status: 'success',
    count: listings.length,
    data: {
      listings,
    },
    listings,
  });
}

// ---------------------------------------------------------------------------
// 4. GET /api/listings/claimed — Retrieve NGO's Claimed Listings
// ---------------------------------------------------------------------------
// ROLE: NGO only
// PREREQUISITES: protect, restrictTo('ngo')
// ---------------------------------------------------------------------------
export async function getMyClaims(req, res) {
  const listings = await Listing.find({ claimedBy: req.user.id })
    .sort({ claimedAt: -1 })
    .populate('donor', 'name organization pickupAddress');

  res.status(200).json({
    status: 'success',
    count: listings.length,
    data: {
      listings,
    },
    listings,
  });
}

// ---------------------------------------------------------------------------
// 5. PATCH /api/listings/:id/claim — Atomic Claim System (Day 4)
// ---------------------------------------------------------------------------
// ROLE: NGO only
// PREREQUISITES: protect, restrictTo('ngo'), validateId
// ATOMIC GUARANTEE:
//   The check (status === 'available' AND expiresAt > now) and the update
//   occur in ONE indivisible database operation via findOneAndUpdate.
//   Even if 20 requests arrive at the exact same millisecond, exactly ONE
//   can ever succeed.
// ---------------------------------------------------------------------------
export async function claimListing(req, res) {
  const { id } = req.params;

  const listing = await Listing.findOneAndUpdate(
    // Filter / Guard: Must match all conditions simultaneously
    {
      _id: id,
      status: 'available',
      expiresAt: { $gt: new Date() },
    },
    // State Mutation: Claim the food and attach claiming NGO
    {
      status: 'claimed',
      claimedBy: req.user.id,
      claimedAt: new Date(),
    },
    // returnDocument: 'after' returns the document in its updated state
    { returnDocument: 'after' }
  ).populate('donor', 'name organization pickupAddress');

  // If no document matched, find out why (404 vs 409)
  if (!listing) {
    return failTransition(
      res,
      { _id: id },
      'This listing was already claimed or has expired'
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      listing,
    },
    listing,
  });
}

// ---------------------------------------------------------------------------
// 6. PATCH /api/listings/:id/complete — Mark as Picked Up (Day 4)
// ---------------------------------------------------------------------------
// ROLE: Donor only (must be the owner donor)
// PREREQUISITES: protect, restrictTo('donor'), validateId
// STATE TRANSITION: claimed -> completed
// ---------------------------------------------------------------------------
export async function completeListing(req, res) {
  const { id } = req.params;

  const listing = await Listing.findOneAndUpdate(
    // Enforce ownership: donor: req.user.id ensures donors can only complete their own listings
    {
      _id: id,
      donor: req.user.id,
      status: 'claimed',
    },
    {
      status: 'completed',
      completedAt: new Date(),
    },
    { returnDocument: 'after' }
  ).populate('claimedBy', 'name organization');

  if (!listing) {
    // Look only among THIS donor's listings to prevent existence leakage (404)
    return failTransition(
      res,
      { _id: id, donor: req.user.id },
      'Only a claimed listing can be marked as picked up'
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      listing,
    },
    listing,
  });
}

// ---------------------------------------------------------------------------
// 7. PATCH /api/listings/:id/cancel — Cancel Listing (Day 4)
// ---------------------------------------------------------------------------
// ROLE: Donor only (must be the owner donor)
// PREREQUISITES: protect, restrictTo('donor'), validateId
// STATE TRANSITION: available OR claimed -> cancelled
// ---------------------------------------------------------------------------
export async function cancelListing(req, res) {
  const { id } = req.params;

  const listing = await Listing.findOneAndUpdate(
    {
      _id: id,
      donor: req.user.id,
      status: { $in: ['available', 'claimed'] },
    },
    {
      status: 'cancelled',
    },
    { returnDocument: 'after' }
  ).populate('claimedBy', 'name organization');

  if (!listing) {
    return failTransition(
      res,
      { _id: id, donor: req.user.id },
      'This listing can no longer be cancelled'
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      listing,
    },
    listing,
  });
}
