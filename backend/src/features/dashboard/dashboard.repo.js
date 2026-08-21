const prisma = require('../../config/prisma');
const xpService = require('../xp/xp.service');

const RECENT_SUBMISSIONS_LIMIT = 10;

// UTC month start, kept as a shared helper so metrics.service.js's
// "current calendar month" and this file's "XP this month" agree.
function monthStart(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

// FR027 — one consolidated payload instead of the 3-4 calls a student
// dashboard would otherwise need (yearly XP, enrollments, recent submissions).
async function getStudentDashboard(userId) {
  const [yearlyXp, enrollments, recentSubmissions] = await Promise.all([
    xpService.getYearlyXp(userId),
    prisma.enrollment.findMany({
      where: { userId },
      include: { module: true },
    }),
    prisma.submission.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
      take: RECENT_SUBMISSIONS_LIMIT,
      include: { module: true },
    }),
  ]);

  return { yearlyXp, enrollments, recentSubmissions };
}

// FR029 — computed aggregates (groupBy/aggregate), distinct from /reports'
// filtered row listing.
async function getManagementAggregates() {
  const [xpAllTime, xpThisMonth, submissionsByStatus, modulesByType] = await Promise.all([
    prisma.xpLedger.aggregate({ _sum: { xpAwarded: true } }),
    prisma.xpLedger.aggregate({
      _sum: { xpAwarded: true },
      where: { createdAt: { gte: monthStart() } },
    }),
    prisma.submission.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.module.groupBy({ by: ['type'], _count: { _all: true } }),
  ]);

  return {
    xpAwarded: {
      allTime: xpAllTime._sum.xpAwarded || 0,
      thisMonth: xpThisMonth._sum.xpAwarded || 0,
    },
    submissionsByStatus: submissionsByStatus.map((r) => ({ status: r.status, count: r._count._all })),
    modulesByType: modulesByType.map((r) => ({ type: r.type, count: r._count._all })),
  };
}

module.exports = { getStudentDashboard, getManagementAggregates, monthStart };
