const prisma = require('../../config/prisma');
const { paginate } = require('../../utils/pagination');

// Filter fields per main PRD open question #9: student, activity type, date
// range, team, and score range are all implemented.
async function queryScores({ userId, moduleType, dateFrom, dateTo, teamId, xpMin, xpMax, page, limit }) {
  const where = {
    submission: {
      userId: userId || undefined,
      teamId: teamId || undefined,
      module: moduleType ? { type: moduleType } : undefined,
    },
    createdAt: {
      gte: dateFrom || undefined,
      lte: dateTo || undefined,
    },
    xpAwarded: {
      gte: xpMin || undefined,
      lte: xpMax || undefined,
    },
  };

  const [rows, total] = await prisma.$transaction([
    prisma.xpLedger.findMany({
      where,
      include: { submission: { include: { module: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.xpLedger.count({ where }),
  ]);

  const data = rows.map((r) => ({
    userId: r.submission.userId,
    moduleType: r.submission.module.type,
    xpAwarded: r.xpAwarded,
    scoredBy: r.scoredBy,
    createdAt: r.createdAt,
  }));

  return paginate({ page, limit }, [data, total]);
}

module.exports = { queryScores };
