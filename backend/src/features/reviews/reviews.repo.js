const { withTransaction } = require('../../config/db');

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
  return withTransaction(async (client) => {
    const review = await client.query(
      `INSERT INTO reviews (submission_id, reviewer_type, reviewer_id, outcome, feedback_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [submissionId, reviewerType, reviewerId || null, outcome, feedbackText]
    );

    const xp = await client.query(
      `INSERT INTO xp_ledger (submission_id, scored_by, xp_awarded, individual_component, team_component)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [submissionId, reviewerType, xpAwarded, individualComponent || null, teamComponent || null]
    );

    await client.query(`UPDATE submissions SET status = 'scored' WHERE id = $1`, [submissionId]);

    return { review: review.rows[0], xp: xp.rows[0] };
  });
}

module.exports = { recordReviewAndXp };
