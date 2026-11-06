export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm shadow-sm"
    >
      <div className="flex items-start gap-2">
        <span className="font-bold text-red-600">⚠</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-950 transition cursor-pointer"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

