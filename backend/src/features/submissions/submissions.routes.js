const { Router } = require('express');
const submissionsService = require('./submissions.service');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = Router();

router.post('/submissions', requireAuth, async (req, res) => {
  const { moduleId, contentRef } = req.body;
  res.status(201).json(await submissionsService.submit(req.user.id, moduleId, contentRef));
});

router.get(
  '/submissions',
  requireAuth,
  requireRole('katalyst_management'),
  async (req, res) => {
    res.json(await submissionsService.listPendingReview());
  }
);

router.get('/submissions/:id', requireAuth, async (req, res) => {
  const submission = await submissionsService.getSubmission(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  res.json(submission);
});

module.exports = router;
