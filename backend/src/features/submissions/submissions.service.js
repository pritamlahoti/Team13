const submissionsRepo = require('./submissions.repo');
const modulesRepo = require('../modules/modules.repo');
const aiCoachService = require('../aiCoach/aiCoach.service');

// Core P0 submit flow (backend PRD section 4.2): objective modules get
// auto-reviewed by the AI Coach inline; subjective ones sit in the
// Management queue as 'pending'.
async function submit(userId, moduleId, contentRef) {
  const module = await modulesRepo.findById(moduleId);
  if (!module) {
    const err = new Error('Module not found');
    err.status = 404;
    throw err;
  }

  const submission = await submissionsRepo.create(userId, moduleId, contentRef);

  if (module.scoring_mode === 'objective') {
    await aiCoachService.reviewObjectiveSubmission(submission, module);
    return submissionsRepo.findById(submission.id);
  }

  return submission;
}

const getSubmission = (id) => submissionsRepo.findById(id);
const listPendingReview = () => submissionsRepo.listPending();

module.exports = { submit, getSubmission, listPendingReview };
