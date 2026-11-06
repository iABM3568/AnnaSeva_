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
//      Instead we store a one-way hash: "password123" → "$2a$12$xK9z..."
//
// NOTE (Mongoose 9): In async pre hooks, Mongoose awaits the returned
// promise. Do NOT declare or call `next()`.
// ---------------------------------------------------------------------------
userSchema.pre('save', async function () {
  // Only hash if the password field was created or changed
  if (!this.isModified('password')) return;

  // Cost factor 12 = 2^12 = 4096 rounds of hashing.
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---------------------------------------------------------------------------
// Instance Method — comparePassword
// ---------------------------------------------------------------------------
// WHAT: Compares a plaintext guess with the stored hash.
// WHO CALLS IT: The login controller — after finding a user by email,
//      it calls user.comparePassword(submittedPassword).
// RETURNS: true if the password matches, false otherwise.
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
