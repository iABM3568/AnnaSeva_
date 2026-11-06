import { Link } from 'react-router';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-5xl font-extrabold text-emerald-600 mb-2">404</div>
      <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-2 text-sm text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          &larr; Back to Home
        </Link>
      </div>
    </main>
  );
}

