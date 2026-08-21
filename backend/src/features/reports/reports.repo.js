const prisma = require('../../config/prisma');

// Filter fields per main PRD open question #9 — student, activity type, and
// date range are implemented; team/score-range filters are P1 (teams table).
async function queryScores({ userId, moduleType, dateFrom, dateTo }) {
  const rows = await prisma.xpLedger.findMany({
    where: {
      submission: {
        userId: userId || undefined,
        module: moduleType ? { type: moduleType } : undefined,
      },
      createdAt: {
        gte: dateFrom || undefined,
        lte: dateTo || undefined,
      },
    },
    include: { submission: { include: { module: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((r) => ({
    userId: r.submission.userId,
    moduleType: r.submission.module.type,
    xpAwarded: r.xpAwarded,
    scoredBy: r.scoredBy,
    createdAt: r.createdAt,
  }));
}

module.exports = { queryScores };
