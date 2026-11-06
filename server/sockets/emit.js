import { getIO } from './index.js';

/**
 * Converts a Mongoose document to a plain JavaScript object if necessary.
 *
 * @param {Object} listing
 * @returns {Object}
 */
const toPlain = (listing) =>
  listing && typeof listing.toObject === 'function' ? listing.toObject() : listing;

/**
 * Extracts a string ID from an ObjectId or a populated user document ({ _id, name, ... }).
 *
 * @param {*} value
 * @returns {string|null}
 */
const idOf = (value) => {
  if (!value) return null;
  return String(value._id ?? value);
};

/**
 * Emits 'listing:new' to all authenticated NGOs.
 * Called immediately AFTER a donor creates a listing in the database.
 *
 * @param {Object} listing - The newly created listing document
 */
export function emitListingNew(listing) {
  const io = getIO();
  if (!io) return;

  const plain = toPlain(listing);
  // Broadcast to the collective 'ngos' room
  io.to('ngos').emit('listing:new', plain);
}

/**
 * Emits 'listing:updated' when a listing transitions state (claimed, completed, cancelled).
 *
 * PRIVACY & DATA MINIMIZATION:
 * 1. General NGOs receive a sanitized payload WITHOUT `claimedBy` details.
 * 2. The donor and the claiming NGO receive the full payload with participant details.
 *
 * @param {Object} listing - The updated listing document
 */
export function emitListingUpdated(listing) {
  const io = getIO();
  if (!io) return;

  const plain = toPlain(listing);
  const donorId = idOf(plain.donor);
  const claimerId = idOf(plain.claimedBy);

  // 1. Privacy-safe public update for other NGOs:
  // Strip `claimedBy` to prevent public disclosure of which NGO claimed the food
  const { claimedBy, ...publicVersion } = plain;

  let otherNgos = io.to('ngos');
  if (claimerId) {
    // Exclude the claiming NGO from the sanitized broadcast (they receive full version below)
    otherNgos = otherNgos.except(`user:${claimerId}`);
  }
  otherNgos.emit('listing:updated', publicVersion);

  // 2. Full update for authorized parties (the Donor who owns the listing and the Claiming NGO):
  const privateRooms = [];
  if (donorId) {
    privateRooms.push(`user:${donorId}`);
  }
  if (claimerId) {
    privateRooms.push(`user:${claimerId}`);
  }

  if (privateRooms.length > 0) {
    io.to(privateRooms).emit('listing:updated', plain);
  }
}
