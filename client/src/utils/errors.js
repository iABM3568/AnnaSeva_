// Turns any error into a short sentence a human can read.
export function getErrorMessage(err) {
  if (err.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Check your connection and try again.';
  }

  const data = err.response?.data;
  if (data?.errors?.length) {
    // Validation errors from Zod: "field: message, field: message"
    return data.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
  }
  return data?.message || err.message || 'Something went wrong';
}

