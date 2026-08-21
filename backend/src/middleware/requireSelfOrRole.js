const httpError = require('../utils/httpError');

// Guards a /:paramName route so a user can only act on their own record
// unless they hold one of the given roles — the "student sees only their own
// XP/progress, management sees anyone's" shape shared by xp and aiCoach routes.
const requireSelfOrRole = (paramName, ...roles) => (req, res, next) => {
  const isSelf = req.user.id === req.params[paramName];
  const hasRole = roles.includes(req.user.role);
  if (!isSelf && !hasRole) return next(httpError(403, 'Forbidden'));
  next();
};

module.exports = requireSelfOrRole;
