export default function EmptyState({ title, hint, children }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center text-gray-600 shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-2xl mb-3">
        🍲
      </div>
      <p className="font-semibold text-gray-900 text-base">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">{hint}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
