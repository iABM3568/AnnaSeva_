// ---------------------------------------------------------------------------
// Reusable Validation Middleware
// ---------------------------------------------------------------------------
// WHAT: A function that accepts a Zod schema and returns Express middleware.
// HOW IT'S USED IN ROUTES:
//   router.post('/register', validate(registerSchema), registerController);
//
// WHAT IT DOES:
//   1. Takes the incoming request data (default: req.body).
//   2. Runs schema.safeParse(data).
//   3. If valid: attaches sanitized data to req.valid and calls next().
//   4. If invalid: sends a 400 Bad Request with a structured list of errors.
//      The controller is NEVER called if validation fails.
// ---------------------------------------------------------------------------

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Support both result.error.issues and result.error.errors across Zod versions
      const rawIssues = result.error.issues || result.error.errors || [];
      const errors = rawIssues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors,
      });
    }

    // Attach only the validated, parsed data to req.valid.
    // This strips any extra fields the user tried to sneak in.
    req.valid = result.data;
    next();
  };
};
