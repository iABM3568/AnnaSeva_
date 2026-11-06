import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
// WHAT: Creates a new user account (donor or NGO).
// INPUT: Validated data at req.valid (from validate(registerSchema) middleware).
// RETURNS: 201 Created with JWT token and safe user object.
// ERRORS:
//   - 409 Conflict if email already exists
// ---------------------------------------------------------------------------
export const register = async (req, res) => {
  // 1. Extract ONLY permitted fields from validated data.
  //    Never use req.body directly — this prevents mass assignment.
  const { name, email, password, role, organization } = req.valid;

  // 2. Check if a user with this email already exists.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      status: 'fail',
      message: 'An account with this email already exists',
    });
  }

  // 3. Create the user.
  //    The User model's pre-save hook will hash the password automatically.
  const user = await User.create({
    name,
    email,
    password,
    role,
    organization,
  });

  // 4. Generate a JWT containing the new user's ID and role.
  const token = generateToken(user);

  // 5. Respond with 201 Created, the token, and safe user data.
  //    The toJSON transform on the User model removes password and __v.
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
// WHAT: Authenticates an existing user and returns a fresh JWT.
// INPUT: Validated email and password at req.valid.
// RETURNS: 200 OK with JWT token and safe user object.
// ERRORS:
//   - 401 Unauthorized for wrong email OR wrong password (generic message)
// ---------------------------------------------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.valid;

  // 1. Find the user by email.
  //    We MUST use .select('+password') because password has select: false
  //    in the schema. Without this, user.password would be undefined!
  const user = await User.findOne({ email }).select('+password');

  // 2. Check if user exists.
  //    If not, return a generic 401 message (prevents user enumeration).
  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }

  // 3. Compare the plaintext password with the stored bcrypt hash.
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }

  // 4. Generate a fresh JWT.
  const token = generateToken(user);

  // 5. Respond with 200 OK, the token, and safe user data.
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
// WHAT: Returns the profile of the currently logged-in user.
// PREREQUISITE: protect middleware must run before this!
//               protect verifies the token and attaches req.user.
// INPUT: req.user (attached by protect middleware).
// RETURNS: 200 OK with the current user's profile.
// ---------------------------------------------------------------------------
export const getMe = async (req, res) => {
  // req.user was already fetched and verified by the protect middleware.
  // No need to query the database again.
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};
