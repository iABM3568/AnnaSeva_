import Listing from '../models/Listing.js';

// ---------------------------------------------------------------------------
// 1. POST /api/listings — Create a Food Listing
// ---------------------------------------------------------------------------
// ROLE: Donor only
// INPUT: Validated data at req.valid (via createListingSchema)
// PREREQUISITES: protect, restrictTo('donor')
// ---------------------------------------------------------------------------
export async function createListing(req, res) {
  // 1. Destructure latitude & longitude from the sanitized fields.
  //    Notice: status, donor, claimedBy are NOT in req.valid because Zod stripped them.
  const { latitude, longitude, ...fields } = req.valid;

  // 2. Create the listing document.
  //    - donor is ALWAYS extracted from the verified JWT (req.user.id), never from req.body.
  //    - coordinates array MUST be [longitude, latitude] per GeoJSON standard.
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
  // Always scope query to the authenticated donor's ID
  const listings = await Listing.find({ donor: req.user.id })
    .sort({ createdAt: -1 }) // Newest first
    .populate('claimedBy', 'name organization email'); // Limited safe user fields

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

  // Let the database do the work:
  // 1. status: 'available' -> only unallocated food
  // 2. expiresAt: { $gt: new Date() } -> server clock excludes expired food
  // 3. location.$near -> spherical geospatial search, automatically sorted nearest first
  const listings = await Listing.find({
    status: 'available',
    expiresAt: { $gt: new Date() }, // Computed expiry check
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat], // Longitude first!
        },
        $maxDistance: radiusKm * 1000, // Convert kilometers to meters
      },
    },
  })
    .limit(50) // Guard against unbounded result sets
    .populate('donor', 'name organization pickupAddress') // Safe fields
    .lean(); // Return plain JS objects for high read throughput

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
