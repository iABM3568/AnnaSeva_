import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// Listing Schema — Represents a surplus food listing posted by a donor
// ---------------------------------------------------------------------------
// Responsibilities:
//   1. Tracks details about the food (title, type, quantity, safety timestamps).
//   2. Stores geospatial coordinates as a standardized GeoJSON Point.
//   3. References the donor who posted it, and the NGO who claims it.
//   4. Enforces three database indexes for fast spatial and relational queries.
// ---------------------------------------------------------------------------

const listingSchema = new mongoose.Schema(
  {
    // --- Food Information ---
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    foodType: {
      type: String,
      enum: {
        values: ['veg', 'non-veg', 'vegan', 'mixed'],
        message: '{VALUE} is not a valid food type',
      },
      required: [true, 'Food type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1 portion/meal'],
      max: [10000, 'Quantity cannot exceed 10,000 portions'],
    },

    // --- Food Safety & Timestamps ---
    preparedAt: {
      type: Date,
      required: [true, 'Preparation timestamp is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration timestamp is required'],
    },

    // --- Pickup & Geographical Information ---
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
      maxlength: [200, 'Pickup address cannot exceed 200 characters'],
    },

    // GeoJSON Point: [LONGITUDE, LATITUDE] <-- Longitude FIRST!
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: (coords) =>
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 && // Longitude (-180 to 180)
            coords[1] >= -90 &&
            coords[1] <= 90, // Latitude (-90 to 90)
          message: 'Coordinates must be [longitude, latitude] within valid geographic ranges',
        },
      },
    },

    // --- Relational Ownership ---
    // Storing donor's ObjectId instead of copying their data (Referencing pattern).
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing must be associated with a donor'],
    },

    // --- Status Lifecycle ---
    // Note: 'expired' is a computed state derived from `expiresAt > new Date()`,
    // rather than a hardcoded status string. This prevents stale state without cron jobs.
    status: {
      type: String,
      enum: {
        values: ['available', 'claimed', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid listing status',
      },
      default: 'available',
    },

    // --- Claim Information ---
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// ---------------------------------------------------------------------------
// Database Indexes
// ---------------------------------------------------------------------------
// 1. 2dsphere index on location:
//    Required for spherical distance calculations and MongoDB's $near operator.
listingSchema.index({ location: '2dsphere' });

// 2. Compound index on donor + createdAt:
//    Optimizes the donor's query: "Show my listings, ordered newest first".
listingSchema.index({ donor: 1, createdAt: -1 });

// 3. Compound index on claimedBy + claimedAt:
//    Optimizes the NGO's query: "Show listings I claimed, ordered newest first".
listingSchema.index({ claimedBy: 1, claimedAt: -1 });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;

