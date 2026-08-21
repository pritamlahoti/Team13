
//sakshi Nagarew
const prisma = require('../../config/prisma');

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

async function listForUser(userId, where = {}, orderBy = { createdAt: 'desc' }, skip = 0, take = 20) {
  const finalWhere = { ...where, submission: { userId } };
  
  const [total, data] = await prisma.$transaction([
    prisma.xpLedger.count({ where: finalWhere }),
    prisma.xpLedger.findMany({
      where: finalWhere,
      orderBy,
      skip,
      take
    })
  ]);
  
  return { total, data };
}

const recordXp = (data) => 
  prisma.xpLedger.create({
    data: {
      submissionId: data.submissionId,
      scoredBy: data.scoredBy,
      xpAwarded: data.xpAwarded
    }
  });

module.exports = { sumForUserYear, listForUser, recordXp };
