const { Router } = require('express');
const dashboardRepo = require('./dashboard.repo');
const metricsService = require('./metrics.service');
const { requireAuth, requireRole } = require('../../middleware/auth');
const requireSelfOrRole = require('../../middleware/requireSelfOrRole');
const { ROLES } = require('../../constants/roles');

const router = Router();

// FR027 — student dashboard: yearly XP + enrollments + recent submissions.
router.get(
  '/dashboard/student/:id',
  requireAuth,
  requireSelfOrRole('id', ROLES.KATALYST_MANAGEMENT, ROLES.HIGHER_MANAGEMENT),
  async (req, res) => {
    res.json(await dashboardRepo.getStudentDashboard(req.params.id));
  }
);

// FR029 — management dashboard: real aggregates, plus the FR030 engagement
// metrics alongside them (same three numbers Higher Management sees below,
// since Katalyst Management benefits from the same oversight signal).
router.get('/dashboard/management', requireAuth, requireRole(ROLES.KATALYST_MANAGEMENT), async (req, res) => {
  const [aggregates, participation, completion, monthlyEngagement] = await Promise.all([
    dashboardRepo.getManagementAggregates(),
    metricsService.participationRate(),
    metricsService.completionRate(),
    metricsService.monthlyEngagementRate(),
  ]);
  res.json({ ...aggregates, participation, completion, monthlyEngagement });
});

// FR028 + FR030 — higher-management dashboard is oversight-only: exactly the
// three named engagement metrics, nothing else.
router.get('/dashboard/higher-management', requireAuth, requireRole(ROLES.HIGHER_MANAGEMENT), async (req, res) => {
  const [participation, completion, monthlyEngagement] = await Promise.all([
    metricsService.participationRate(),
    metricsService.completionRate(),
    metricsService.monthlyEngagementRate(),
  ]);
  res.json({ participation, completion, monthlyEngagement });
});

module.exports = router;
