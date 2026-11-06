/**
 * Geo utilities for AnnaSeva client
 *
 * 1. Haversine distance formula: computes straight-line distance on Earth in km.
 * 2. Coordinate flip: MongoDB GeoJSON uses [longitude, latitude], whereas
 *    Leaflet and Google Maps require [latitude, longitude].
 *    We centralize this conversion in `listingLatLng` to avoid coordinate flip bugs.
 */

// Convert degrees to radians for trigonometric functions
const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula.
 *
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in kilometers
 */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/**
 * Extracts Leaflet-compatible [latitude, longitude] from a MongoDB GeoJSON listing.
 *
 * @param {Object} listing - Document containing location.coordinates: [lng, lat]
 * @returns {[number, number]} [lat, lng]
 */
export function listingLatLng(listing) {
  if (!listing?.location?.coordinates || listing.location.coordinates.length < 2) {
    return [0, 0];
  }
  const [lng, lat] = listing.location.coordinates;
  return [lat, lng];
}

/**
 * Formats distance in km to user-friendly human readable string
 * e.g. "450 m" for < 1km, or "3.2 km" for >= 1km
 *
 * @param {number} km
 * @returns {string}
 */
export function formatDistance(km) {
  if (typeof km !== 'number' || isNaN(km)) return '';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

