import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Controlled inputs: React state is the single source of truth for input values
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auto-login support for automated demo screenshots / presentations (e.g. /login?auto=donor)
  useEffect(() => {
    const autoRole = searchParams.get('auto');
    const redirectUrl = searchParams.get('redirect');
    if (autoRole === 'donor' || autoRole === 'ngo') {
      const email = autoRole === 'donor' ? 'donor.demo@example.com' : 'ngo.demo@example.com';
      const password = 'Demo@12345';
      setForm({ email, password });
      setSubmitting(true);
      login(email, password)
        .then((user) => {
          navigate(redirectUrl || (user.role === 'donor' ? '/donor' : '/ngo'), { replace: true });
        })
        .catch((err) => {
          setError(getErrorMessage(err));
          setSubmitting(false);
        });
    }
  }, [searchParams, login, navigate]);

  // Single handler for form fields using e.target.name
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Stop standard browser page reload
    setError('');
    setSubmitting(true);

    try {
      const user = await login(form.email, form.password);
      // Redirect to role-specific dashboard
      navigate(user.role === 'donor' ? '/donor' : '/ngo', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 mt-8">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h1>
        <p className="mt-1 text-sm text-gray-500 text-center">
          Log in to your AnnaSeva account
        </p>

        {/* role="alert" ensures assistive technologies announce errors */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Quick-fill demo credentials helper for evaluators */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 text-center mb-2">Quick Demo Logins (Click to Fill):</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setForm({ email: 'donor.demo@example.com', password: 'Demo@12345' })}
              className="px-2.5 py-1 text-xs rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              🌱 Demo Donor
            </button>
            <button
              type="button"
              onClick={() => setForm({ email: 'ngo.demo@example.com', password: 'Demo@12345' })}
              className="px-2.5 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
            >
              🤝 Demo NGO
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to AnnaSeva?{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

