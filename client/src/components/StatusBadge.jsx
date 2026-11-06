// Lookup table: status -> Tailwind colour classes.
const STYLES = {
  available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  claimed: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

export default function StatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : 'cancelled';
  const badgeClass = STYLES[normalized] || STYLES.cancelled;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${badgeClass}`}
    >
      {normalized}
    </span>
  );
}
