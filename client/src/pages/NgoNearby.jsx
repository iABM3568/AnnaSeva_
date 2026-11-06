import { useAuth } from '../context/AuthContext';

export default function NgoNearby() {
  const { user } = useAuth();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NGO Food Discovery Portal</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, <span className="font-semibold text-emerald-700">{user?.name}</span> ({user?.role})
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Verified NGO
          </span>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-900">Nearby Surplus Food Claims</h2>
          <p className="mt-2 text-sm text-blue-800">
            Your NGO portal is authenticated and protected. Interactive geospatial map discovery and atomic one-click claiming will be connected in Day 7.
          </p>
          <div className="mt-4 flex gap-3 text-xs text-blue-700">
            <span>Email: <strong>{user?.email}</strong></span>
            {user?.organization && <span>• Organization: <strong>{user?.organization}</strong></span>}
          </div>
        </div>
      </div>
    </main>
  );
}

