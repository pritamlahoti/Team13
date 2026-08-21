const { Router } = require('express');
const reportsService = require('./reports.service');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = Router();

router.get('/reports', requireAuth, requireRole('katalyst_management'), async (req, res) => {
  const { userId, moduleType, dateFrom, dateTo } = req.query;
  res.json(await reportsService.generateReport({ userId, moduleType, dateFrom, dateTo }));
});

module.exports = router;
