const { Router } = require('express');
const submissionsService = require('./submissions.service');
const {
  createSubmissionSchema,
  listSubmissionsQuerySchema,
  assignTeamSchema,
} = require('./submissions.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const httpError = require('../../utils/httpError');
const { ROLES } = require('../../constants/roles');

const router = Router();

// Step 1 of the video upload flow: frontend calls this to get a presigned
// Vercel Blob client token, uploads the video directly to Blob storage with
// it, then calls POST /submissions below with the resulting blob URL.
router.post('/submissions/video-upload-token', requireAuth, async (req, res) => {
  res.json(await submissionsService.createVideoUploadToken(req, req.user.id));
});

router.post(
  '/submissions',
  requireAuth,
  requireRole(ROLES.STUDENT),
  validate(createSubmissionSchema),
  async (req, res) => {
    const { moduleId, contentRef } = req.body;
    res.status(201).json(await submissionsService.submit(req.user.id, moduleId, contentRef));
  }
);

// FR015: tag a submission as individual/team work. Either the owning student
// or a katalyst_management user may set it (see submissions.service.assignTeam).
router.patch(
  '/submissions/:id/team',
  requireAuth,
  validate(assignTeamSchema),
  async (req, res) => {
    const result = await submissionsService.assignTeam(
      req.params.id,
      req.body.teamId,
      req.user.id,
      req.user.role
    );
    res.json(result);
  }
);

router.get(
  '/submissions',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(listSubmissionsQuerySchema, 'query'),
  async (req, res) => {
    res.json(await submissionsService.listPendingReview(req.validatedQuery));
  }
);

router.get('/submissions/:id', requireAuth, async (req, res) => {
  const submission = await submissionsService.getSubmission(req.params.id);
  if (!submission) throw httpError(404, 'Submission not found');
  res.json(submission);
});

module.exports = router;
