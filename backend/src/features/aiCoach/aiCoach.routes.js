const { Router } = require('express');
const aiCoachService = require('./aiCoach.service');
const { nudgeSchema } = require('./aiCoach.schema');
const submissionsService = require('../submissions/submissions.service');
const xpService = require('../xp/xp.service');
const authRepo = require('../auth/auth.repo');
const { requireAuth, requireRole } = require('../../middleware/auth');
const requireSelfOrRole = require('../../middleware/requireSelfOrRole');
const validate = require('../../middleware/validate');
const httpError = require('../../utils/httpError');
const { ROLES } = require('../../constants/roles');

const router = Router();

// Draft feedback for a subjective submission still in the Management queue
// (backend PRD section 4.4) — does not score or move it out of 'pending'.
router.post(
  '/submissions/:id/ai-review',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  async (req, res) => {
    const submission = await submissionsService.getSubmission(req.params.id);
    if (!submission) throw httpError(404, 'Submission not found');
    const draftFeedback = await aiCoachService.draftFeedback(submission);
    res.json({ draftFeedback });
  }
);

router.post(
  '/ai-coach/nudge',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(nudgeSchema),
  async (req, res) => {
    const user = await authRepo.findById(req.body.userId);
    if (!user) throw httpError(404, 'User not found');
    res.json({ message: await aiCoachService.generateNudge(user) });
  }
);

router.get(
  '/users/:id/progress-updates',
  requireAuth,
  requireSelfOrRole('id', ROLES.KATALYST_MANAGEMENT, ROLES.HIGHER_MANAGEMENT),
  async (req, res) => {
    const user = await authRepo.findById(req.params.id);
    if (!user) throw httpError(404, 'User not found');
    const stats = await xpService.getYearlyXp(req.params.id);
    res.json({ update: await aiCoachService.generateProgressUpdate(user, stats) });
  }
);

module.exports = router;
