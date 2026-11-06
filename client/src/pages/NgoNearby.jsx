import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import useGeolocation from '../hooks/useGeolocation';
import { getErrorMessage } from '../utils/errors';
import { distanceKm, formatDistance, listingLatLng } from '../utils/geo';
import ListingMap from '../components/ListingMap';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { useSocket } from '../context/SocketContext';

export default function NgoNearby() {
  const { coords: gpsCoords, error: geoError, loading: geoLoading, locate } = useGeolocation();

  const [center, setCenter] = useState(null); // Search center coordinates: { lat, lng }
  const [radiusKm, setRadiusKm] = useState(10);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [claimingId, setClaimingId] = useState(null); // ID of listing currently undergoing claim operation

  // Whenever GPS detects a physical location, set it as the active search center
  useEffect(() => {
    if (gpsCoords) {
      setCenter(gpsCoords);
    }
  }, [gpsCoords]);

  // Request GPS position automatically when mounting the page
  useEffect(() => {
    locate();
  }, [locate]);

  // Guard against STALE async responses:
  // If the volunteer changes radius 2km -> 50km rapidly, two requests are in-flight.
  // We number each request and ignore responses that do not match the latest ID.
  const latestRequest = useRef(0);

  const loadNearby = useCallback(async () => {
    if (!center) return;
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/listings/nearby', {
        params: {
          lat: center.lat,
          lng: center.lng,
          radiusKm,
        },
      });

      // Discard this response if a newer request was dispatched while this was in flight
      if (requestId !== latestRequest.current) return;

      setListings(data.listings || []);
      setLoading(false);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }, [center, radiusKm]);

  useEffect(() => {
    loadNearby();
  }, [loadNearby]);

  // ---------------------------------------------------------------------------
  // REAL-TIME UPDATES (Socket.IO)
  // ---------------------------------------------------------------------------
  // Subscribes to live server events:
  // - listing:new: New food donation posted -> Prepend to list if within radius
  // - listing:updated: Food claimed/cancelled -> Remove from available view
  // - reconnect: Re-fetch entire list from API to catch missed events
  // ---------------------------------------------------------------------------
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !center) return;

    function handleNew(listing) {
      // Proximity check: Only display if within this NGO's active search radius
      const km = distanceKm(center.lat, center.lng, ...listingLatLng(listing));
      if (km > radiusKm) return;

      setListings((previous) =>
        previous.some((l) => l._id === listing._id) ? previous : [listing, ...previous]
      );
      setNotice(`New food donation nearby: "${listing.title}" (${listing.quantity} portions)`);
    }

    function handleUpdated(listing) {
      // If the listing was claimed, completed or cancelled, it is no longer available to discover
      if (listing.status !== 'available') {
        setListings((previous) => previous.filter((l) => l._id !== listing._id));
      }
    }

    socket.on('listing:new', handleNew);
    socket.on('listing:updated', handleUpdated);
    socket.io.on('reconnect', loadNearby);

    // CLEANUP: Unbind listeners on unmount or dependency update to avoid memory leaks
    return () => {
      socket.off('listing:new', handleNew);
      socket.off('listing:updated', handleUpdated);
      socket.io.off('reconnect', loadNearby);
    };
  }, [socket, center, radiusKm, loadNearby]);

  /**
   * Atomic claim handler (ADR 006 Pessimistic UI Updates)
   *
   * Awaits server confirmation before updating state:
   * - 200 OK: Volunteer wins the claim -> Remove card from available list and show directions notice.
   * - 409 Conflict: Another NGO claimed first or food expired -> Remove card and show friendly notice.
   */
  async function handleClaim(listing) {
    const confirmed = window.confirm(
      `Claim "${listing.title}"? Your organization is committing to collect this food.`
    );
    if (!confirmed) return;

    setClaimingId(listing._id);
    try {
      const { data } = await api.patch(`/listings/${listing._id}/claim`);
      // Claim succeeded
      setListings((prev) => prev.filter((item) => item._id !== listing._id));
      setNotice(
        `Successfully claimed "${data.listing.title}". Pickup: ${data.listing.pickupAddress}. View it anytime under "My claims".`
      );
    } catch (err) {
      setNotice(getErrorMessage(err));
      // HTTP 409 Conflict: Another NGO won or the listing expired. Remove it from view.
      if (err.response?.status === 409) {
        setListings((prev) => prev.filter((item) => item._id !== listing._id));
      }
    } finally {
      setClaimingId(null);
    }
  }

  // Quick fallback if GPS is unavailable/blocked on desktop
  function handleUseDefaultCenter() {
    setCenter({ lat: 18.5204, lng: 73.8567 }); // Pune default
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Near You</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover and claim surplus food donations in your collection radius.
          </p>
        </div>

        {/* Filter and Location Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={locate}
            disabled={geoLoading}
            className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            {geoLoading ? 'Detecting GPS...' : '📍 Use My Location'}
          </button>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>Radius:</span>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {[2, 5, 10, 25, 50].map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {geoError && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center justify-between">
          <span>⚠️ {geoError} You can click anywhere on the map or use a default location.</span>
          {!center && (
            <button
              onClick={handleUseDefaultCenter}
              className="ml-3 text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold px-2.5 py-1 rounded transition"
            >
              Set Pune (18.52, 73.85)
            </button>
          )}
        </div>
      )}

      <div className="mt-4">
        <Notice message={notice} onClose={() => setNotice('')} />
      </div>

      {/* Starting point required */}
      {!center ? (
        <div className="mt-6">
          <EmptyState
            title="We need a starting location"
            hint="Allow browser geolocation or click below to explore surplus donations in Pune."
          >
            <button
              onClick={handleUseDefaultCenter}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Explore Pune Region
            </button>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Interactive Map */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Geospatial Discovery Map
              </span>
              <span className="text-xs text-gray-500">
                Tip: Click anywhere on the map to re-center search
              </span>
            </div>
            <ListingMap
              center={center}
              radiusKm={radiusKm}
              listings={listings}
              onPick={setCenter}
            />
          </div>

          {/* Listings List Area */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Available Donations ({listings.length})
              </h2>
              <span className="text-xs text-gray-500">
                Sorted by proximity • Showing within {radiusKm} km
              </span>
            </div>

            {loading && <Loader text="Searching nearby listings..." />}
            {error && <ErrorMessage message={error} onRetry={loadNearby} />}

            {!loading && !error && listings.length === 0 && (
              <EmptyState
                title="No food available in this area right now"
                hint="Try expanding the search radius or clicking another location on the map. New donations will appear here."
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((listing) => {
                const km = distanceKm(center.lat, center.lng, ...listingLatLng(listing));
                const isClaiming = claimingId === listing._id;

                return (
                  <ListingCard key={listing._id} listing={listing}>
                    <div className="flex items-center justify-between w-full pt-1">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        📍 {formatDistance(km)} away
                      </span>

                      <button
                        onClick={() => handleClaim(listing)}
                        disabled={isClaiming}
                        className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isClaiming ? 'Claiming...' : 'Claim Food'}
                      </button>
                    </div>
                  </ListingCard>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
