const httpError = require('../utils/httpError');

// Validates req[source] against a Zod schema and replaces it with the parsed
// result — so trimming/casing/type-coercion/defaults declared in the schema
// actually reach the service layer instead of the raw client input.
//
// req.query is a read-only getter in Express 5 (reassigning it silently
// no-ops), so a validated query string lands on req.validatedQuery instead —
// routes must read from there, not req.query, after this middleware runs.
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || source}: ${issue.message}`)
      .join('; ');
    return next(httpError(400, message));
  }
  if (source === 'query') {
    req.validatedQuery = result.data;
  } else {
    req[source] = result.data;
  }
  next();
};

module.exports = validate;
