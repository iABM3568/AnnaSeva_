import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// JWT Token Generator
// ---------------------------------------------------------------------------
// WHAT: Creates a signed JSON Web Token containing the user's ID and role.
//
// PARAMETERS:
//   user: a Mongoose User document (needs _id and role)
//
// WHAT GOES IN THE PAYLOAD:
//   - id: the MongoDB ObjectId (as a string)
//   - role: 'donor' or 'ngo'
//
// WHAT NEVER GOES IN THE PAYLOAD:
//   - password hash (security risk)
//   - sensitive personal info (emails, phones)
//   - large objects (bloats the token size sent with EVERY request)
//
// EXPIRY: 7 days ('7d'). After 7 days, the token expires and the user
//         must log in again.
// ---------------------------------------------------------------------------

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

