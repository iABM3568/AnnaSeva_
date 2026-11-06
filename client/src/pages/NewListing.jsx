import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import useGeolocation from '../hooks/useGeolocation';
import { getErrorMessage } from '../utils/errors';
import { toLocalInputValue } from '../utils/format';

function makeInitialForm() {
  const now = new Date();
  const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return {
    title: '',
    description: '',
    foodType: 'veg',
    quantity: 10,
    preparedAt: toLocalInputValue(now),
    expiresAt: toLocalInputValue(threeHoursLater),
    pickupAddress: '',
    manualLat: '',
    manualLng: '',
  };
}

export default function NewListing() {
  const navigate = useNavigate();
  const { coords, setCoords, error: geoError, loading: geoLoading, locate } = useGeolocation();
  const [form, setForm] = useState(makeInitialForm);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleManualCoordApply() {
    const lat = parseFloat(form.manualLat);
    const lng = parseFloat(form.manualLng);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Please enter a valid latitude between -90 and 90.');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Please enter a valid longitude between -180 and 180.');
      return;
    }
    setCoords({ lat, lng });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!coords) {
      setError('Please share your pickup location or enter coordinates before posting.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        foodType: form.foodType,
        quantity: Number(form.quantity),
        preparedAt: new Date(form.preparedAt).toISOString(),
        expiresAt: new Date(form.expiresAt).toISOString(),
        pickupAddress: form.pickupAddress.trim(),
        latitude: Number(coords.lat),
        longitude: Number(coords.lng),
      };

      await api.post('/listings', payload);
      navigate('/donor');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Post Surplus Food</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share surplus food with nearby verified NGOs for immediate redistribution.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Title / Description Summary
            </label>
            <input
              name="title"
              type="text"
              required
              minLength={3}
              maxLength={100}
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. 50 Packets of Fresh Veg Biryani & Raita"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Food Type & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Type</label>
              <select
                name="foodType"
                value={form.foodType}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="veg">Vegetarian (Veg)</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="mixed">Mixed Meal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity (Number of Portions/Meals)
              </label>
              <input
                name="quantity"
                type="number"
                required
                min={1}
                max={10000}
                value={form.quantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Details <span className="text-xs text-gray-400 font-normal">(optional, packaging, storage)</span>
            </label>
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Cooked today at 2 PM for a corporate luncheon. Packed in sealed hygienic foil containers. Needs refrigeration if not distributed within 2 hours."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Timings: Prepared At & Expires At */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prepared Time</label>
              <input
                name="preparedAt"
                type="datetime-local"
                required
                value={form.preparedAt}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-gray-400">When the food was cooked</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Safe Until (Expires At)</label>
              <input
                name="expiresAt"
                type="datetime-local"
                required
                value={form.expiresAt}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-gray-400">Must be consumed before this time</span>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
            <input
              name="pickupAddress"
              type="text"
              required
              minLength={5}
              maxLength={200}
              value={form.pickupAddress}
              onChange={handleChange}
              placeholder="e.g. Hotel Grand Park, Back Entrance Gate 3, MG Road, Pune"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Location / Geolocation Section */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Geographical Coordinates for NGO Map Discovery
            </label>
            <p className="text-xs text-gray-500 mb-3">
              NGOs find food by distance. Your GPS location allows nearby collectors to find and claim this food quickly.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={locate}
                disabled={geoLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-300 px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
              >
                <span>📍</span>
                <span>
                  {geoLoading
                    ? 'Acquiring GPS...'
                    : coords
                    ? 'Re-detect Current Location'
                    : 'Use My Current Location'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualCoords(!showManualCoords)}
                className="text-xs text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
              >
                {showManualCoords ? 'Hide manual coordinates' : 'Enter coordinates manually'}
              </button>
            </div>

            {coords && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-100/60 rounded px-3 py-1.5 border border-emerald-200">
                <span className="font-bold">✓ Location Set:</span>
                <span>Latitude {coords.lat.toFixed(5)}, Longitude {coords.lng.toFixed(5)}</span>
              </div>
            )}

            {geoError && (
              <p className="mt-2 text-xs text-red-600 font-medium">{geoError}</p>
            )}

            {showManualCoords && (
              <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  name="manualLat"
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g. 18.5204)"
                  value={form.manualLat}
                  onChange={handleChange}
                  className="rounded border border-gray-300 px-2.5 py-1.5 text-xs bg-white"
                />
                <input
                  name="manualLng"
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g. 73.8567)"
                  value={form.manualLng}
                  onChange={handleChange}
                  className="rounded border border-gray-300 px-2.5 py-1.5 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleManualCoordApply}
                  className="rounded bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-emerald-700 cursor-pointer"
                >
                  Apply Coordinates
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
          >
            {submitting ? 'Publishing Food Listing...' : 'Publish Food Listing'}
          </button>
        </form>
      </div>
    </main>
  );
}

