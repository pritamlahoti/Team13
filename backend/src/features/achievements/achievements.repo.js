const prisma = require('../../config/prisma');

async function getUserStats(userId) {
  const [xpAgg, submissionCount, projectCount, distinctModules] = await Promise.all([
    prisma.xpLedger.aggregate({ _sum: { xpAwarded: true }, where: { submission: { userId } } }),
    prisma.submission.count({ where: { userId, status: 'scored' } }),
    prisma.submission.count({ where: { userId, status: 'scored', module: { type: 'project' } } }),
    prisma.submission.groupBy({ by: ['moduleId'], where: { userId, status: 'scored' } }),
  ]);

  return {
    totalXp: xpAgg._sum.xpAwarded || 0,
    submissionCount,
    projectCount,
    distinctModuleCount: distinctModules.length,
  };
}

module.exports = { getUserStats };
