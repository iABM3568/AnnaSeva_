import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ---------------------------------------------------------------------------
// protect Middleware — Authentication Guard
// ---------------------------------------------------------------------------
// WHAT IT DOES:
//   1. Inspects the HTTP Authorization header for a Bearer token.
//   2. Cryptographically verifies the token using JWT_SECRET.
//   3. Ensures the token hasn't expired or been tampered with.
//   4. Fetches the active user from MongoDB to ensure the account still exists.
//   5. Attaches the user document to `req.user` and calls next().
//
// WHY:
//   Any route protected by this middleware can trust that `req.user`
//   is an authenticated, active user.
// ---------------------------------------------------------------------------
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for Authorization header formatted as: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If token is missing, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in. Please provide a token to gain access.',
    });
  }

  // 3. Verify the token signature and expiration
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Distinguish between invalid/expired token and system errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid authentication token.',
    });
  }

  // 4. Confirm the user still exists in the database
  //    (In case the user was deleted after the token was issued)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token no longer exists.',
    });
  }

  // 5. Grant access: attach user to request object
  req.user = currentUser;
  next();
};

// ---------------------------------------------------------------------------
// restrictTo Middleware — Role-based Authorization Guard
// ---------------------------------------------------------------------------
// WHAT IT DOES:
//   Accepts an array of permitted roles (e.g., 'donor', 'ngo').
//   Checks if req.user.role is included in the allowed list.
//
// PREREQUISITE:
//   MUST ALWAYS BE PLACED AFTER protect middleware!
//   Example: router.get('/donor-only', protect, restrictTo('donor'), controller);
//
// WHY ORDER MATTERS:
//   `protect` is responsible for AUTHENTICATION (identifying WHO the user is).
//   `restrictTo` is responsible for AUTHORIZATION (checking WHAT they can do).
//   `restrictTo` relies on `req.user` which `protect` creates.
// ---------------------------------------------------------------------------
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // If req.user is missing, developer incorrectly used restrictTo without protect
    if (!req.user) {
      return res.status(500).json({
        status: 'error',
        message: 'Authentication context missing. Use protect before restrictTo.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};
