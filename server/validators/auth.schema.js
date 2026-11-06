import { z } from 'zod';

// ---------------------------------------------------------------------------
// Register Schema — validates the data sent during user registration
// ---------------------------------------------------------------------------
// Every rule here matches the User model constraints, but checks them
// BEFORE the database is even touched.
// ---------------------------------------------------------------------------
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    // 72 characters is the maximum input length bcrypt can handle.
    // Inputs longer than 72 bytes are silently truncated by bcrypt,
    // which can create subtle security issues. We enforce the limit here.
    .max(72, 'Password cannot exceed 72 characters'),

  role: z.enum(['donor', 'ngo'], {
    errorMap: () => ({ message: 'Role must be either "donor" or "ngo"' }),
  }),

  organization: z
    .string()
    .trim()
    .max(120, 'Organization name cannot exceed 120 characters')
    .optional(),
});

// ---------------------------------------------------------------------------
// Login Schema — validates the data sent during login
// ---------------------------------------------------------------------------
// Only email and password are required.
// We don't enforce the 8-char password minimum here because:
//   1. That's a registration rule, not a login rule.
//   2. If a user somehow had a shorter password from an older system,
//      they'd be locked out if we rejected it at login.
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

