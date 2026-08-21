const { Router } = require('express');
const xpService = require('./xp.service');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = Router();

function canView(req) {
  return req.user.id === req.params.id || req.user.role !== 'student';
}

router.get('/users/:id/xp', requireAuth, async (req, res) => {
  if (!canView(req)) return res.status(403).json({ error: 'Forbidden' });
  const year = req.query.year ? Number(req.query.year) : undefined;
  res.json(await xpService.getYearlyXp(req.params.id, year));
});

router.get('/users/:id/xp/ledger', requireAuth, async (req, res) => {
  if (!canView(req)) return res.status(403).json({ error: 'Forbidden' });
  res.json(await xpService.getLedger(req.params.id));
});

module.exports = router;
