const { Router } = require('express');
const achievementsService = require('./achievements.service');
const { requireAuth } = require('../../middleware/auth');
const requireSelfOrRole = require('../../middleware/requireSelfOrRole');
const { ROLES } = require('../../constants/roles');

const router = Router();

// FR021 — student views own achievements; management can view anyone's.
router.get(
  '/users/:id/achievements',
  requireAuth,
  requireSelfOrRole('id', ROLES.KATALYST_MANAGEMENT, ROLES.HIGHER_MANAGEMENT),
  async (req, res) => {
    res.json(await achievementsService.getUserAchievements(req.params.id));
  }
);

module.exports = router;
