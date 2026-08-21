const { Router } = require('express');
const leaderboardRepo = require('./leaderboard.repo');
const { leaderboardQuerySchema } = require('./leaderboard.schema');
const { requireAuth } = require('../../middleware/auth');
const validate = require('../../middleware/validate');

const router = Router();

// FR018-019 — individual & team leaderboards, ranked by total XP.
router.get('/leaderboard', requireAuth, validate(leaderboardQuerySchema, 'query'), async (req, res) => {
  const { scope, limit, year } = req.validatedQuery;
  const entries =
    scope === 'team'
      ? await leaderboardRepo.teamLeaderboard({ limit, year })
      : await leaderboardRepo.individualLeaderboard({ limit, year });
  res.json({ scope, year: year || null, entries });
});

module.exports = router;
