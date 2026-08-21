const { Router } = require('express');
const xpService = require('./xp.service');
const { yearQuerySchema, ledgerQuerySchema } = require('./xp.schema');
const { requireAuth } = require('../../middleware/auth');
const requireSelfOrRole = require('../../middleware/requireSelfOrRole');
const validate = require('../../middleware/validate');
const { ROLES } = require('../../constants/roles');

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
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/users/:id/xp/ledger',
  requireAuth,
  canViewUser,
  validate(ledgerQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const data = await xpService.getLedger(req.params.id, req.validatedQuery);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

