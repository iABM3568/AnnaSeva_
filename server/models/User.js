import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------------
// User Schema — the blueprint for every user document in MongoDB
// ---------------------------------------------------------------------------
// Think of this as a registration form's rules:
//   - Which fields are required?
//   - What type must each field be?
//   - What limits do we enforce?
// Mongoose checks these rules BEFORE saving anything to the database.
// ---------------------------------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,                     // removes leading/trailing whitespace
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,                   // MongoDB creates an index — no two users share an email
      lowercase: true,                // "John@Gmail.COM" → "john@gmail.com"
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,                  // NEVER include password in query results by default
    },

    role: {
      type: String,
      enum: {
        values: ['donor', 'ngo'],     // ONLY these two values are allowed
        message: '{VALUE} is not a valid role',
      },
      required: [true, 'Role is required'],
    },

    organization: {
      type: String,
      trim: true,
      maxlength: [120, 'Organization name cannot exceed 120 characters'],
    },
  },
  {
    // Mongoose automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// Pre-save Hook — runs automatically BEFORE a document is saved
// ---------------------------------------------------------------------------
// WHY: We must NEVER store a plaintext password in the database.
//      If someone breaches the database, they'd see every user's password.
//      Instead we store a one-way hash: "password123" → "$2a$12$xK9z..."
//      You can verify a guess against the hash, but you CANNOT reverse
//      the hash back to the original password.
//
// IMPORTANT: We check `this.isModified('password')` because this hook
//      runs on EVERY save — including when we update a user's name.
//      Without this guard, we'd hash the ALREADY-hashed password again,
//      making login impossible.
// ---------------------------------------------------------------------------
userSchema.pre('save', async function (next) {
  // Only hash if the password field was created or changed
  if (!this.isModified('password')) return next();

  // Cost factor 12 = 2^12 = 4096 rounds of hashing.
  // Higher = slower to crack, but also slower to register/login.
  // 12 is the current industry recommendation for bcrypt.
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------------------------------------------------------------------------
// Instance Method — comparePassword
// ---------------------------------------------------------------------------
// WHAT: Compares a plaintext guess with the stored hash.
// WHO CALLS IT: The login controller — after finding a user by email,
//      it calls user.comparePassword(submittedPassword).
// RETURNS: true if the password matches, false otherwise.
//
// NOTE: bcrypt.compare handles the salt internally — you don't
//      need to extract or pass the salt separately.
// ---------------------------------------------------------------------------
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ---------------------------------------------------------------------------
// JSON Transformation — control what gets sent to the client
// ---------------------------------------------------------------------------
// When Express calls res.json(user), Mongoose calls toJSON() internally.
// We remove `password` and `__v` (Mongoose version key) so they never
// appear in API responses, even if a developer forgets `select: false`.
// This is a safety net — defense in depth.
// ---------------------------------------------------------------------------
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export default User;

