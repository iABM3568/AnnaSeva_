// "2026-10-25T18:30" in the format <input type="datetime-local"> needs, in LOCAL time.
export function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0'); // 7 -> "07"
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// "Expired", "45 min left", "2h 10m left"
export function timeLeft(expiresAt) {
  const ms = new Date(expiresAt) - Date.now();
  if (ms <= 0) return 'Expired';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} min left`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m left`;
}

// Derived status: an "available" listing past its expiry is shown as "expired".
export function displayStatus(listing) {
  if (listing.status === 'available' && new Date(listing.expiresAt) < new Date()) {
    return 'expired';
  }
  return listing.status;
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }); // user's local time
}

