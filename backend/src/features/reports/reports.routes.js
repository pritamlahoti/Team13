const { Router } = require('express');
const reportsService = require('./reports.service');
const { reportQuerySchema } = require('./reports.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.get(
  '/reports',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(reportQuerySchema, 'query'),
  async (req, res) => {
    res.json(await reportsService.generateReport(req.validatedQuery));
  }
);

module.exports = router;
