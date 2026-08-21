const { Router } = require('express');
const xpService = require('./xp.service');
const { yearQuerySchema } = require('./xp.schema');
const { requireAuth } = require('../../middleware/auth');
const requireSelfOrRole = require('../../middleware/requireSelfOrRole');
const validate = require('../../middleware/validate');
const { ROLES } = require('../../constants/roles');
const { formatPaginatedResponse, formatSuccessResponse } = require('../admin/admin.utils');

const router = Router();

const canViewUser = requireSelfOrRole('id', ROLES.KATALYST_MANAGEMENT, ROLES.HIGHER_MANAGEMENT);

router.get(
  '/users/:id/xp',
  requireAuth,
  canViewUser,
  validate(yearQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const data = await xpService.getYearlyXp(req.params.id, req.validatedQuery.year);
      res.json(formatSuccessResponse(data));
    } catch (err) {
      next(err);
    }
  }
);

router.get('/users/:id/xp/ledger', requireAuth, canViewUser, async (req, res, next) => {
  try {
    const { total, data, page, limit } = await xpService.getLedger(req.params.id, req.query);
    res.json(formatPaginatedResponse(data, total, { page, limit }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
