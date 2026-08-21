const { Router } = require('express');
const submissionsService = require('./submissions.service');
const { createSubmissionSchema } = require('./submissions.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const httpError = require('../../utils/httpError');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.post('/submissions', requireAuth, validate(createSubmissionSchema), async (req, res) => {
  const { moduleId, contentRef } = req.body;
  res.status(201).json(await submissionsService.submit(req.user.id, moduleId, contentRef));
});

router.get(
  '/submissions',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  async (req, res) => {
    res.json(await submissionsService.listPendingReview());
  }
);

router.get('/submissions/:id', requireAuth, async (req, res) => {
  const submission = await submissionsService.getSubmission(req.params.id);
  if (!submission) throw httpError(404, 'Submission not found');
  res.json(submission);
});

module.exports = router;
