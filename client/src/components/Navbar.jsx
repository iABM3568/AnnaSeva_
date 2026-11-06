import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-base font-bold shadow-sm">
            AS
          </span>
          <span>
            Anna<span className="text-emerald-600">Seva</span>
          </span>
        </Link>

        {/* Dynamic Navigation Links by Role */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          {!user && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-emerald-600 px-3 py-1.5 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3.5 py-1.5 shadow-sm transition"
              >
                Register
              </Link>
            </div>
          )}

          {user?.role === 'donor' && (
            <div className="flex items-center gap-4">
              <Link
                to="/donor"
                className="text-gray-700 hover:text-emerald-600 transition"
              >
                My Listings
              </Link>
              <Link
                to="/donor/new"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white font-medium hover:bg-emerald-700 shadow-sm transition"
              >
                + Post Food
              </Link>
            </div>
          )}

          {user?.role === 'ngo' && (
            <div className="flex items-center gap-4">
              <Link
                to="/ngo"
                className="text-gray-700 hover:text-emerald-600 transition"
              >
                Find Food
              </Link>
              <Link
                to="/ngo/claims"
                className="text-gray-700 hover:text-emerald-600 transition"
              >
                My Claims
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-gray-900">{user.name}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-2.5 py-1.5 hover:bg-red-50 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
