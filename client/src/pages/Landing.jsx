import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
        Zero Hunger Initiative
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
        Anna<span className="text-emerald-600">Seva</span>
      </h1>
      <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
        Bridging the gap between surplus food donors and local NGOs to eliminate hunger in our communities.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        {user ? (
          <Link
            to={user.role === 'donor' ? '/donor' : '/ngo'}
            className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Go to Your {user.role === 'donor' ? 'Donor' : 'NGO'} Dashboard &rarr;
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-white px-6 py-3 text-base font-medium text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 transition"
            >
              Log In
            </Link>
          </>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
            🍲
          </div>
          <h2 className="text-lg font-bold text-gray-900">For Food Donors</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Restaurants, caterers, hotels, and individuals can list fresh surplus food in seconds with pickup coordinates and expiry times.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
            🤝
          </div>
          <h2 className="text-lg font-bold text-gray-900">For NGOs & Volunteers</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Discover available food donations within your geographical radius, claim instantly with concurrency guarantees, and coordinate distribution.
          </p>
        </div>
      </div>
    </main>
  );
}
