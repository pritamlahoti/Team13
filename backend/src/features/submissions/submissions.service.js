const submissionsRepo = require('./submissions.repo');
const modulesRepo = require('../modules/modules.repo');
const aiCoachService = require('../aiCoach/aiCoach.service');
const httpError = require('../../utils/httpError');

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
const listPendingReview = () => submissionsRepo.listPending();

module.exports = { submit, getSubmission, listPendingReview };
