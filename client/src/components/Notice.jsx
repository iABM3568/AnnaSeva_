export default function Notice({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="text-emerald-600 font-bold">✓</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-0.5 rounded hover:bg-emerald-100 transition cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  );
}
