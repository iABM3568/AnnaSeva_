import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import { getErrorMessage } from '../utils/errors';
import { displayStatus } from '../utils/format';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { useSocket } from '../context/SocketContext';

export default function DonorDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true); // State 1: Loading
  const [error, setError] = useState(''); // State 2: Error
  const [notice, setNotice] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  const { socket } = useSocket();

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/listings/mine');
      // Backend returns both data.listings and data.data.listings
      const list = data.listings || data.data?.listings || [];
      setListings(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // Real-time listener for status changes (e.g. NGO claims donation)
  useEffect(() => {
    if (!socket) return;

    function handleUpdated(listing) {
      // Update matching listing in state
      setListings((previous) =>
        previous.map((l) => (l._id === listing._id ? listing : l))
      );
      if (listing.status === 'claimed') {
        const claimerName =
          listing.claimedBy?.organization || listing.claimedBy?.name || 'An NGO';
        setNotice(`🤝 ${claimerName} claimed "${listing.title}"! Please prepare for pickup.`);
      }
    }

    socket.on('listing:updated', handleUpdated);
    socket.io.on('reconnect', loadListings);

    return () => {
      socket.off('listing:updated', handleUpdated);
      socket.io.off('reconnect', loadListings);
    };
  }, [socket, loadListings]);

  // Action is 'complete' or 'cancel'. The server evaluates whether the transition is allowed.
  async function handleAction(id, action) {
    if (action === 'cancel') {
      const confirmed = window.confirm(
        'Are you sure you want to cancel this listing? Once cancelled, it cannot be claimed.'
      );
      if (!confirmed) return;
    }

    setActionInProgress(id);
    try {
      const { data } = await api.patch(`/listings/${id}/${action}`);
      const updated = data.listing || data.data?.listing;

      // Replace just this listing with the authoritative server version
      setListings((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );

      setNotice(
        action === 'complete'
          ? 'Donation marked as picked up! Thank you for reducing food waste.'
          : 'Food listing has been cancelled.'
      );
    } catch (err) {
      setNotice(getErrorMessage(err));
    } finally {
      setActionInProgress(null);
    }
  }

  // Four-state rendering
  if (loading) {
    return <Loader text="Loading your food donation listings..." />;
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={loadListings} />
      </main>
    );
  }

  // Derived groups
  const activeListings = listings.filter(
    (l) => ['available', 'claimed'].includes(l.status) && displayStatus(l) !== 'expired'
  );
  const historyListings = listings.filter((l) => !activeListings.includes(l));

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Post Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your active food donations and track collection history.
          </p>
        </div>
        <Link
          to="/donor/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <span>+</span>
          <span>Post New Donation</span>
        </Link>
      </div>

      {/* Notice Alert */}
      <div className="mt-4">
        <Notice message={notice} onClose={() => setNotice('')} />
      </div>

      {/* State 3: Empty State */}
      {listings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="You haven't posted any food donations yet"
            hint="Surplus meals from your restaurant, catering, or event can nourish families today."
          >
            <Link
              to="/donor/new"
              className="inline-block mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Post Your First Listing
            </Link>
          </EmptyState>
        </div>
      ) : (
        /* State 4: Data State */
        <div className="mt-6 space-y-8">
          {/* Active Listings Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Active Listings</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 font-semibold">
                  {activeListings.length}
                </span>
              </h2>
            </div>

            {activeListings.length === 0 ? (
              <p className="text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                No active listings right now. Have surplus food?{' '}
                <Link to="/donor/new" className="text-emerald-600 underline font-medium">
                  Post a new donation
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeListings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing}>
                    {listing.status === 'claimed' && (
                      <button
                        onClick={() => handleAction(listing._id, 'complete')}
                        disabled={actionInProgress === listing._id}
                        className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                      >
                        {actionInProgress === listing._id ? 'Updating...' : 'Mark Picked Up'}
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(listing._id, 'cancel')}
                      disabled={actionInProgress === listing._id}
                      className="rounded-lg border border-red-300 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 transition cursor-pointer"
                    >
                      {actionInProgress === listing._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </ListingCard>
                ))}
              </div>
            )}
          </section>

          {/* Past History Section */}
          {historyListings.length > 0 && (
            <section className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>History & Past Donations</span>
                  <span className="rounded-full bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 font-semibold">
                    {historyListings.length}
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-90">
                {historyListings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
