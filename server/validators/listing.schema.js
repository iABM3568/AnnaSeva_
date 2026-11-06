import { z } from 'zod';

// Maximum duration a surplus food listing can be offered (24 hours).
// Food safety policy: Cooked/surplus food degrades rapidly and must be consumed within a day.
const MAX_HOURS_AHEAD = 24;

// ---------------------------------------------------------------------------
// blankIsMissing Preprocessor Helper
// ---------------------------------------------------------------------------
// WHY THIS IS CRUCIAL:
//   z.coerce.number() converts an empty string "" into the number 0.
//   z.coerce.date() converts null or "" into 1 January 1970 (Unix epoch).
//   Without this helper, an empty latitude or date field would silently pass
//   coercion and corrupt the database (e.g. saving latitude: 0, longitude: 0).
//   This helper converts "" and null into `undefined` so Zod's required checks fire.
// ---------------------------------------------------------------------------
const blankIsMissing = (value) => (value === '' || value === null ? undefined : value);

// ---------------------------------------------------------------------------
// 1. Create Listing Schema
// ---------------------------------------------------------------------------
// Used by: POST /api/listings
// Validates donor input and strips unauthorized client fields (status, donor, etc.)
// ---------------------------------------------------------------------------
export const createListingSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title cannot exceed 100 characters'),

    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),

    foodType: z.enum(['veg', 'non-veg', 'vegan', 'mixed'], {
      errorMap: () => ({ message: 'Food type must be veg, non-veg, vegan, or mixed' }),
    }),

    quantity: z.coerce
      .number({ required_error: 'Quantity is required' })
      .int('Quantity must be a whole number')
      .min(1, 'Quantity must be at least 1 portion')
      .max(10000, 'Quantity cannot exceed 10,000 portions'),

    preparedAt: z.preprocess(
      blankIsMissing,
      z.coerce.date({ required_error: 'Preparation time is required', invalid_type_error: 'Invalid preparation date' })
    ),

    expiresAt: z.preprocess(
      blankIsMissing,
      z.coerce.date({ required_error: 'Expiration time is required', invalid_type_error: 'Invalid expiration date' })
    ),

    pickupAddress: z
      .string({ required_error: 'Pickup address is required' })
      .trim()
      .min(5, 'Please provide a full pickup address (at least 5 characters)')
      .max(200, 'Pickup address cannot exceed 200 characters'),

    // The API accepts intuitive latitude & longitude numbers.
    // The server maps these into the GeoJSON [longitude, latitude] array.
    latitude: z.preprocess(
      blankIsMissing,
      z.coerce
        .number({ required_error: 'Latitude is required', invalid_type_error: 'Latitude must be a valid number' })
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
    ),

    longitude: z.preprocess(
      blankIsMissing,
      z.coerce
        .number({ required_error: 'Longitude is required', invalid_type_error: 'Longitude must be a valid number' })
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
    ),
  })
  // Refinement 1: Food cannot be prepared in the future (with 1-minute server clock tolerance)
  .refine((data) => data.preparedAt.getTime() <= Date.now() + 60000, {
    message: 'Preparation time cannot be in the future',
    path: ['preparedAt'],
  })
  // Refinement 2: Expiry must be in the future
  .refine((data) => data.expiresAt.getTime() > Date.now(), {
    message: 'Expiry time must be in the future',
    path: ['expiresAt'],
  })
  // Refinement 3: Expiry must be chronologically after preparation
  .refine((data) => data.expiresAt.getTime() > data.preparedAt.getTime(), {
    message: 'Expiry time must be after the preparation time',
    path: ['expiresAt'],
  })
  // Refinement 4: Expiration cannot exceed 24 hours from current moment (food-safety window)
  .refine((data) => data.expiresAt.getTime() - Date.now() <= MAX_HOURS_AHEAD * 3600 * 1000, {
    message: `Food can be listed for a maximum of ${MAX_HOURS_AHEAD} hours into the future`,
    path: ['expiresAt'],
  });

// ---------------------------------------------------------------------------
// 2. Nearby Query Schema
// ---------------------------------------------------------------------------
// Used by: GET /api/listings/nearby?lat=18.5204&lng=73.8567&radiusKm=5
// Validates query parameters sent by NGOs searching on a map or list.
// ---------------------------------------------------------------------------
export const nearbySchema = z.object({
  lat: z.preprocess(
    blankIsMissing,
    z.coerce
      .number({ required_error: 'lat query parameter is required' })
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
  ),
  lng: z.preprocess(
    blankIsMissing,
    z.coerce
      .number({ required_error: 'lng query parameter is required' })
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
  ),
  radiusKm: z.preprocess(
    blankIsMissing,
    z.coerce
      .number()
      .min(0.5, 'Radius must be at least 0.5 km')
      .max(50, 'Radius cannot exceed 50 km')
      .default(10)
  ),
});

