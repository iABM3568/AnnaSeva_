import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Controlled form state matching backend Zod schema
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    role: 'donor', // Default to donor
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Build payload matching backend Zod validation rules
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      // Only include organization if user provided one
      if (form.organization.trim()) {
        payload.organization = form.organization.trim();
      }

      const user = await register(payload);
      // Redirect to respective role portal
      navigate(user.role === 'donor' ? '/donor' : '/ngo', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-6 mt-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Join AnnaSeva</h1>
        <p className="mt-1 text-sm text-gray-500 text-center">
          Register to donate surplus food or collect for communities in need
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                  form.role === 'donor'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="donor"
                  checked={form.role === 'donor'}
                  onChange={handleChange}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium">Food Donor</span>
                  <span className="block text-xs text-gray-500">I have surplus food to share</span>
                </div>
              </label>

              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                  form.role === 'ngo'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="ngo"
                  checked={form.role === 'ngo'}
                  onChange={handleChange}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium">NGO / Collector</span>
                  <span className="block text-xs text-gray-500">I collect & distribute food</span>
                </div>
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar or Ananya Sen"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-xs text-gray-400 font-normal">(min. 8 characters)</span>
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Organization (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organization Name <span className="text-xs text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="organization"
              type="text"
              value={form.organization}
              onChange={handleChange}
              placeholder="e.g. Annapurna Kitchens or Seva Trust"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

