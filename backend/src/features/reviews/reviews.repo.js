const prisma = require('../../config/prisma');

// Writes the reviews row + xp_ledger row + submission status flip as one
// transaction so XP is never credited without a recorded review (PRD section 12).
async function recordReviewAndXp({
  submissionId,
  reviewerType,
  reviewerId,
  outcome,
  feedbackText,
  xpAwarded,
  individualComponent,
  teamComponent,
}) {
  return prisma.$transaction(
    async (tx) => {
      const review = await tx.review.create({
        data: { submissionId, reviewerType, reviewerId: reviewerId || null, outcome, feedbackText },
      });

      const xp = await tx.xpLedger.create({
        data: {
          submissionId,
          scoredBy: reviewerType,
          xpAwarded,
          individualComponent: individualComponent || null,
          teamComponent: teamComponent || null,
        },
      });

      await tx.submission.update({ where: { id: submissionId }, data: { status: 'scored' } });

      return { review, xp };
    },
    { maxWait: 10000, timeout: 20000 }
  );
}

module.exports = { recordReviewAndXp };
