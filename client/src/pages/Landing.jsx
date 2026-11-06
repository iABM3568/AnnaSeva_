import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * ImpactCounter: Displays real-time database-aggregated platform metrics.
 * Gracefully degrades (renders null) if the statistics endpoint is slow or unreachable,
 * ensuring the landing page is never blocked or broken.
 */
function ImpactCounter() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get('/stats')
      .then(({ data }) => {
        if (active && data) {
          setStats(data);
        }
      })
      .catch(() => {
        // Impact numbers are decorative; if the call fails, degrade silently without error banners
      });

    return () => {
      active = false;
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-10 py-6 px-8 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm max-w-xl mx-auto text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-800 mb-1">
        Verified Community Impact
      </p>
      <div className="flex items-center justify-center gap-8 mt-2">
        <div>
          <span className="block text-4xl sm:text-5xl font-black text-emerald-800">
            {stats.mealsRescued.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm font-medium text-emerald-700">
            Meals Rescued
          </span>
        </div>
        <div className="h-10 w-px bg-emerald-300" aria-hidden="true" />
        <div>
          <span className="block text-4xl sm:text-5xl font-black text-emerald-800">
            {stats.pickups.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm font-medium text-emerald-700">
            Completed Pickups
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'donor' ? '/donor' : '/ngo';

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wide mb-4">
        Zero Hunger Initiative
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
        Surplus food, to the people who need it,{' '}
        <span className="text-emerald-700">before it spoils.</span>
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        AnnaSeva connects restaurants, caterers, hostels, and banquet halls with verified local NGOs.
        Post what is left over, and the nearest organization claims and collects it.
      </p>

      {/* Primary Action Controls */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {user ? (
          <Link
            to={dashboardPath}
            className="rounded-lg bg-emerald-700 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-800 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Go to Your {user.role === 'donor' ? 'Donor' : 'NGO'} Dashboard &rarr;
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="rounded-lg bg-emerald-700 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-800 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
            >
              Log In
            </Link>
          </>
        )}
      </div>

      {/* Dynamic Impact Counter */}
      <ImpactCounter />

      {/* Step-by-Step Overview */}
      <section className="mt-16 text-left max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          How AnnaSeva Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-base">Donors Post Surplus</h3>
              <p className="mt-2 text-sm text-gray-600">
                Restaurants and caterers post what food is left: portions, food type, pickup location, and expiry window.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-base">NGOs Discover Nearby</h3>
              <p className="mt-2 text-sm text-gray-600">
                Nearby charities view donations on an interactive OpenStreetMap with calculated distances, updated live via WebSockets.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-base">Atomic Claiming</h3>
              <p className="mt-2 text-sm text-gray-600">
                One NGO claims the food with zero race conditions. Other NGOs see it disappear instantly from their screens.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-gray-900 text-base">Pickup & Impact</h3>
              <p className="mt-2 text-sm text-gray-600">
                The NGO navigates to pickup via Google Maps directions. The donor confirms pickup, adding to our rescued meals counter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
