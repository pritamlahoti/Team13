const xpRepo = require('./xp.repo');

const BASE_XP = {
  session: 10,
  course: 50,
  mentoring: 20,
  project: 80,
  assignment: 30,
  milestone: 15
};

const calculateXp = (moduleType, score = 100, submittedAt = new Date(), dueDate = null) => {
  const base = BASE_XP[moduleType] || 0;
  const qualityXp = Math.floor(base * (score / 100));

  let finalXp = qualityXp;

  if (dueDate) {
    const daysEarly = (new Date(dueDate).getTime() - new Date(submittedAt).getTime()) / (1000 * 3600 * 24);
    
    if (daysEarly > 7) {
      finalXp += Math.floor(qualityXp * 0.20);
    } else if (daysEarly >= 3) {
      finalXp += Math.floor(qualityXp * 0.10);
    } else if (daysEarly > 0) {
      finalXp += Math.floor(qualityXp * 0.05);
    }
  }

  return finalXp;
};

const awardSubmissionXp = async (submissionId, moduleType, score, submittedAt, dueDate, reviewerType = 'management') => {
  const finalXp = calculateXp(moduleType, score, submittedAt, dueDate);

  if (finalXp > 0) {
    return xpRepo.recordXp({
      submissionId,
      scoredBy: reviewerType,
      xpAwarded: finalXp
    });
  }
  return null;
};

const getYearlyXp = (userId, year = new Date().getFullYear()) =>
  xpRepo.sumForUserYear(userId, year).then((totalXp) => ({ userId, year, totalXp }));

const getLedger = (userId, pagination) => xpRepo.listForUser(userId, pagination);

module.exports = { calculateXp, awardSubmissionXp, getYearlyXp, getLedger };

