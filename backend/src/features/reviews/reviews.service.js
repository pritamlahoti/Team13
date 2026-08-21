const reviewsRepo = require('./reviews.repo');

// Management's manual scoring path (backend PRD section 4.2, step 4) —
// the AI Coach's autonomous path calls reviewsRepo directly from aiCoach.service.
const scoreSubmission = ({
  submissionId,
  managementUserId,
  outcome,
  feedbackText,
  xpAwarded,
  individualComponent,
  teamComponent,
}) =>
  reviewsRepo.recordReviewAndXp({
    submissionId,
    reviewerType: 'management',
    reviewerId: managementUserId,
    outcome,
    feedbackText,
    xpAwarded,
    individualComponent,
    teamComponent,
  });

module.exports = { scoreSubmission };
