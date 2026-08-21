const prisma = require('../../config/prisma');
const { paginate } = require('../../utils/pagination');

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

const listForUser = (userId, pagination) => {
  if (pagination && pagination.page) {
    const { page, limit } = pagination;
    return prisma
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
  }
  return prisma.xpLedger.findMany({
    where: { submission: { userId } },
    orderBy: { createdAt: 'desc' },
  });
};

const recordXp = (data) => 
  prisma.xpLedger.create({
    data: {
      submissionId: data.submissionId,
      scoredBy: data.scoredBy,
      xpAwarded: data.xpAwarded
    }
  });

module.exports = { sumForUserYear, listForUser, recordXp };

