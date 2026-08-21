const { Router } = require('express');
const aiCoachService = require('./aiCoach.service');
const { nudgeSchema } = require('./aiCoach.schema');
const submissionsService = require('../submissions/submissions.service');
const xpService = require('../xp/xp.service');
const notificationsService = require('../notifications/notifications.service');
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
    // Idempotency check-then-send lives in notificationsService.sendNudgeIfDue
    // so this route and the scheduled job (src/jobs/nudgeScheduler.js) share
    // the one code path that actually sends a nudge (backend PRD §8/§4.4).
    const result = await notificationsService.sendNudgeIfDue(user, () =>
      aiCoachService.generateNudge(user)
    );
    if (!result.sent) {
      return res.status(200).json({ message: null, alreadySent: true, lastSentAt: result.lastSentAt });
    }
    res.json({ message: result.message });
  }
);

// FR025: no Challenge model exists yet in prisma/schema.prisma and adding a
// migration is out of scope for this round — honest "not implemented" rather
// than a fake in-memory feature that vanishes on restart.
router.get('/ai-coach/challenges', requireAuth, async (_req, res) => {
  res.status(501).json({ error: 'Challenges are not yet implemented (no data model)' });
});

router.post(
  '/ai-coach/challenges',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  async (_req, res) => {
    res.status(501).json({ error: 'Challenges are not yet implemented (no data model)' });
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
