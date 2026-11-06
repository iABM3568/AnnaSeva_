import { useState, useCallback } from 'react';

// A custom hook: reusable "get user's location" logic with loading and error state.
export default function useGeolocation() {
  const [coords, setCoords] = useState(null); // { lat, lng } once granted
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useCallback memoizes the locate function across renders
  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Your browser does not support geolocation.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        if (err.code === 1) {
          setError('Location permission was denied. Please allow location access in your browser.');
        } else if (err.code === 2) {
          setError('Location unavailable. Check network or GPS connection.');
        } else if (err.code === 3) {
          setError('Location request timed out. Please try again.');
        } else {
          setError('Could not retrieve your current location.');
        }
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return { coords, setCoords, error, loading, locate };
}

