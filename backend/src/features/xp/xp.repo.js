const prisma = require('../../config/prisma');
const { paginate } = require('../../utils/pagination');

// xp_ledger is append-only (PRD section 9); "yearly" XP is summed from
// created_at since submissions/modules carry no explicit programme year yet.
async function sumForUserYear(userId, year) {
  const { _sum } = await prisma.xpLedger.aggregate({
    _sum: { xpAwarded: true },
    where: {
      submission: { userId },
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
  return _sum.xpAwarded || 0;
}

const listForUser = (userId, { page, limit }) =>
  prisma
    .$transaction([
      prisma.xpLedger.findMany({
        where: { submission: { userId } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.xpLedger.count({ where: { submission: { userId } } }),
    ])
    .then((result) => paginate({ page, limit }, result));

module.exports = { sumForUserYear, listForUser };
