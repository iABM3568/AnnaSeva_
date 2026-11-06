// ---------------------------------------------------------------------------
// 404 Not Found Middleware
// ---------------------------------------------------------------------------
// WHAT: Catch-all handler for any route that does not match any registered endpoint.
// PLACEMENT: Must be registered AFTER all API route handlers, but BEFORE errorHandler.
// ---------------------------------------------------------------------------
export const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
  });
};

// ---------------------------------------------------------------------------
// Centralized Error Handling Middleware
// ---------------------------------------------------------------------------
// Express recognizes an error handler ONLY when it has exactly 4 arguments:
// (err, req, res, next).
//
// WHAT IT DOES:
//   Catches all unhandled errors passed through next(err) or thrown in async handlers.
//   Translates confusing database and syntax errors into clean, client-friendly JSON.
// ---------------------------------------------------------------------------
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Always log full error details on the server for debugging
  console.error('🔥 Server Error:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // 1. Handle JSON parse error (e.g., malformed body sent by client)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON syntax in request body';
  }

  // 2. Handle MongoDB Duplicate Key Error (Code 11000)
  // Example: Attempting to register with an email that is already in the database
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // 3. Handle Mongoose Validation Error
  // Example: Schema constraints violated at the database level
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = `Validation Error: ${errors.join('. ')}`;
  }

  // 4. Handle Mongoose CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Send uniform JSON response to client
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
