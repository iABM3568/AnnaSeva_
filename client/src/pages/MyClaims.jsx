import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { getErrorMessage } from '../utils/errors';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router';
import { useSocket } from '../context/SocketContext';

export default function MyClaims() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/listings/claimed');
      setListings(data.listings || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  // Real-time listener for updates to claimed donations (e.g. marked completed by donor)
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    function handleUpdated(listing) {
      setListings((previous) =>
        previous.map((l) => (l._id === listing._id ? listing : l))
      );
    }

    socket.on('listing:updated', handleUpdated);
    socket.io.on('reconnect', loadClaims);

    return () => {
      socket.off('listing:updated', handleUpdated);
      socket.io.off('reconnect', loadClaims);
    };
  }, [socket, loadClaims]);

  if (loading) return <Loader text="Loading your claimed donations..." />;
  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={loadClaims} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
          <p className="text-sm text-gray-500 mt-1">
            Food donations your organization has claimed. Coordinate pickup and get driving directions.
          </p>
        </div>
        <Link
          to="/ngo"
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← Find More Food
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="You haven't claimed any donations yet"
            hint="Discover surplus food available near you and claim it to coordinate collection."
          >
            <Link
              to="/ngo"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Explore Nearby Food
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Active & Past Claims ({listings.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => {
              const coords = listing.location?.coordinates;
              const hasValidCoords =
                Array.isArray(coords) &&
                coords.length >= 2 &&
                typeof coords[0] === 'number' &&
                typeof coords[1] === 'number';

              // MongoDB GeoJSON stores [longitude, latitude]
              const [lng, lat] = hasValidCoords ? coords : [null, null];
              const donorName =
                listing.donor?.organization || listing.donor?.name || 'Verified Food Donor';

              return (
                <ListingCard key={listing._id} listing={listing}>
                  <div className="w-full flex flex-col gap-2.5 pt-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Donor:</span> {donorName}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Status:{' '}
                        <strong className="capitalize text-gray-700">
                          {listing.status}
                        </strong>
                      </span>

                      {/* Google Maps Directions Link (dest=lat,lng) */}
                      {hasValidCoords && listing.status === 'claimed' && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition"
                        >
                          <span>🗺️</span>
                          <span>Get Directions</span>
                        </a>
                      )}
                    </div>
                  </div>
                </ListingCard>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

