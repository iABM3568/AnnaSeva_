import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// validateId Middleware
// ---------------------------------------------------------------------------
// WHAT IT DOES:
//   Validates that the :id parameter in route URLs (e.g. /api/listings/:id/claim)
//   is a syntactically valid 24-character hexadecimal MongoDB ObjectId.
//
// WHY IT MATTERS:
//   Stops malformed IDs (e.g., "123", "abc", undefined) at the gateway
//   BEFORE reaching the database, returning an immediate 400 Bad Request.
// ---------------------------------------------------------------------------
export function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid listing id',
    });
  }
  next();
}

