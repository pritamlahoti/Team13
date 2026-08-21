const jwt = require('jsonwebtoken');
const httpError = require('../utils/httpError');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(httpError(401, 'Missing token'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.user_id, role: payload.role };
    next();
  } catch {
    next(httpError(401, 'Invalid or expired token'));
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(httpError(403, 'Forbidden'));
  }
  next();
};

module.exports = { requireAuth, requireRole };
