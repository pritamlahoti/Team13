const gemini = require('./geminiClient');
const reviewsRepo = require('../reviews/reviews.repo');
const submissionsRepo = require('../submissions/submissions.repo');

// ponytail: flat XP per module type is a placeholder for PRD open question #2
// (backend PRD section 9) — replace with Management's per-module lookup table
// once that's decided.
const XP_RULES = {
  session: 10,
  course: 20,
  mentoring: 15,
  project: 40,
  assignment: 25,
  milestone: 15,
};

function sanitizeForPrompt(text) {
  // Basic prompt-injection hygiene (backend PRD section 7) — the XP number is
  // never taken from the model's output, only the feedback text is.
  return String(text || '').slice(0, 2000);
}

// Autonomous path for objective modules (backend PRD section 4.2/4.3):
// Gemini writes the feedback, a fixed rule computes XP — never the reverse.
async function reviewObjectiveSubmission(submission, module) {
  const prompt = `You are an encouraging learning coach. Write brief (2-3 sentence) feedback for a student's submission to a "${module.type}" activity. Submission notes: ${sanitizeForPrompt(submission.content_ref)}`;

  let feedbackText;
  try {
    feedbackText = await gemini.generateText(prompt);
  } catch {
    // Required safeguard (section 4.4): never block the student on a Gemini failure.
    return submissionsRepo.markPending(submission.id);
  }

  const xpAwarded = XP_RULES[module.type] ?? 10;
  return reviewsRepo.recordReviewAndXp({
    submissionId: submission.id,
    reviewerType: 'ai_coach',
    outcome: 'approved',
    feedbackText,
    xpAwarded,
  });
}

async function draftFeedback(submission) {
  try {
    return await gemini.generateText(
      `Summarize this student submission for a human reviewer in 2-3 sentences: ${sanitizeForPrompt(submission.content_ref)}`
    );
  } catch {
    return null;
  }
}

const generateNudge = (user) =>
  gemini.generateText(
    `Write a short, friendly re-engagement message for ${user.name}, who has shown reduced activity in the Katalyst programme.`
  );

const generateProgressUpdate = (user, stats) =>
  gemini.generateText(
    `Write a short natural-language progress summary for ${user.name}. Stats: ${JSON.stringify(stats)}.`
  );

module.exports = { reviewObjectiveSubmission, draftFeedback, generateNudge, generateProgressUpdate };
