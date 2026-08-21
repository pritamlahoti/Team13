const { Router } = require('express');
const aiCoachService = require('./aiCoach.service');
const submissionsService = require('../submissions/submissions.service');
const xpService = require('../xp/xp.service');
const authRepo = require('../auth/auth.repo');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = Router();

// Draft feedback for a subjective submission still in the Management queue
// (backend PRD section 4.4) — does not score or move it out of 'pending'.
router.post(
  '/submissions/:id/ai-review',
  requireAuth,
  requireRole('katalyst_management'),
  async (req, res) => {
    const submission = await submissionsService.getSubmission(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    const draftFeedback = await aiCoachService.draftFeedback(submission);
    res.json({ draftFeedback });
  }
);

router.post('/ai-coach/nudge', requireAuth, requireRole('katalyst_management'), async (req, res) => {
  const { userId } = req.body;
  const user = await authRepo.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: await aiCoachService.generateNudge(user) });
});

router.get('/users/:id/progress-updates', requireAuth, async (req, res) => {
  const user = await authRepo.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const stats = await xpService.getYearlyXp(req.params.id);
  res.json({ update: await aiCoachService.generateProgressUpdate(user, stats) });
});

module.exports = router;
