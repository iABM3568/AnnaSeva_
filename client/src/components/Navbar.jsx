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
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white text-base">
            AS
          </span>
          <span>
            Anna<span className="text-emerald-600">Seva</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'donor' ? '/donor' : '/ngo'}
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition"
              >
                Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                Hi, <strong className="text-gray-900">{user.name}</strong>
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 px-3 py-1.5 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3.5 py-1.5 shadow-sm transition"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
