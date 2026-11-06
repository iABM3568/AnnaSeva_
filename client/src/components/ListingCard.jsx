import StatusBadge from './StatusBadge';
import { displayStatus, formatDateTime, timeLeft } from '../utils/format';

// "children" lets each page put its OWN buttons inside the card (Cancel/Complete for donors, Claim for NGOs).
export default function ListingCard({ listing, children }) {
  const status = displayStatus(listing);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
        <StatusBadge status={status} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-emerald-50 text-emerald-800 font-semibold px-2 py-1">
          {listing.quantity} {listing.quantity === 1 ? 'portion' : 'portions'}
        </span>
        <span className="rounded-md bg-gray-100 text-gray-700 font-medium px-2 py-1 capitalize">
          {listing.foodType}
        </span>
      </div>

      {listing.description && (
        <p className="mt-2.5 text-sm text-gray-600 line-clamp-2">
          {listing.description}
        </p>
      )}

      <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
        <p className="flex items-center gap-1.5">
          <span className="text-gray-400">📍</span>
          <span className="font-medium text-gray-800">Pickup:</span> {listing.pickupAddress}
        </p>
        <p className="flex items-center gap-1.5">
          <span className="text-gray-400">⏳</span>
          <span className="font-medium text-gray-800">Expires:</span>{' '}
          {formatDateTime(listing.expiresAt)}{' '}
          <span className="text-emerald-700 font-semibold">({timeLeft(listing.expiresAt)})</span>
        </p>
        {listing.claimedBy && (
          <p className="flex items-center gap-1.5 text-blue-700 font-medium">
            <span>🤝</span>
            <span>Claimed by: {listing.claimedBy.organization || listing.claimedBy.name}</span>
          </p>
        )}
      </div>

      {children && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
          {children}
        </div>
      )}
    </article>
  );
}
