const rateLimit = require('express-rate-limit');

// Backend PRD section 7: blunt brute-force attempts against login, even for
// a hackathon build. Keyed by IP (the default) since there's no user
// identity yet at this point in the request.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

module.exports = { loginLimiter };
