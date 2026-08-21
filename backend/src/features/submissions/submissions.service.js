const { handleUpload } = require('@vercel/blob/client');
const submissionsRepo = require('./submissions.repo');
const modulesRepo = require('../modules/modules.repo');
const aiCoachService = require('../aiCoach/aiCoach.service');
const httpError = require('../../utils/httpError');
const { ROLES } = require('../../constants/roles');

const VIDEO_CONTENT_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

// Presigned-upload step (backend PRD production flow): frontend calls this to
// get a short-lived Vercel Blob client token, then uploads the video straight
// to Blob storage (bypassing this server entirely), then reports the
// resulting blob URL back via submit()'s contentRef. No onUploadCompleted
// webhook here - this server isn't guaranteed a public URL Vercel can call
// back to, so the frontend's explicit submit() call is the source of truth.
async function createVideoUploadToken(req, userId) {
  return handleUpload({
    body: req.body,
    request: req,
    onBeforeGenerateToken: async (pathname, clientPayload) => {
      const { moduleId } = JSON.parse(clientPayload || '{}');
      if (!moduleId) throw httpError(400, 'moduleId is required');

      const module = await modulesRepo.findById(moduleId);
      if (!module) throw httpError(404, 'Module not found');

      return {
        allowedContentTypes: VIDEO_CONTENT_TYPES,
        maximumSizeInBytes: MAX_VIDEO_BYTES,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ userId, moduleId }),
      };
    },
  });
}

// Core P0 submit flow (backend PRD section 4.2): objective modules get
// auto-reviewed by the AI Coach inline; subjective ones sit in the
// Management queue as 'pending'.
async function submit(userId, moduleId, contentRef) {
  const module = await modulesRepo.findById(moduleId);
  if (!module) throw httpError(404, 'Module not found');

  const submission = await submissionsRepo.create(userId, moduleId, contentRef);

  if (module.scoringMode === 'objective') {
    await aiCoachService.reviewObjectiveSubmission(submission, module);
    return submissionsRepo.findById(submission.id);
  }

  return submission;
}

const getSubmission = (id) => submissionsRepo.findById(id);
const listPendingReview = (pagination) => submissionsRepo.listPending(pagination);

// FR015: student who owns the submission, or katalyst_management, may tag it
// as individual/team work — same ownership-check style as
// enrollments.service.markComplete.
async function assignTeam(submissionId, teamId, userId, role) {
  const submission = await submissionsRepo.findById(submissionId);
  if (!submission || (submission.userId !== userId && role !== ROLES.KATALYST_MANAGEMENT)) {
    throw httpError(404, 'Submission not found');
  }
  return submissionsRepo.setTeam(submissionId, teamId);
}

module.exports = {
  submit,
  getSubmission,
  listPendingReview,
  createVideoUploadToken,
  assignTeam,
};
