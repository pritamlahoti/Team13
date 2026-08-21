const prisma = require('../../config/prisma');
const { ROLES } = require('../../constants/roles');
const { monthStart } = require('./dashboard.repo');

// FR030 — the three named engagement metrics. Each returns
// {rate, numerator, denominator} so callers can show the raw counts too.
const asRate = (numerator, denominator) => ({
  rate: denominator ? numerator / denominator : 0,
  numerator,
  denominator,
});

const distinctSubmittingUserCount = (where) =>
  prisma.submission.groupBy({ by: ['userId'], where }).then((rows) => rows.length);

// students with >=1 submission / total enrolled students
async function participationRate() {
  const [enrolledStudents, submittingStudents] = await Promise.all([
    prisma.enrollment.groupBy({ by: ['userId'] }),
    distinctSubmittingUserCount({}),
  ]);
  return asRate(submittingStudents, enrolledStudents.length);
}

// completed enrollments / total enrollments
async function completionRate() {
  const [completed, total] = await Promise.all([
    prisma.enrollment.count({ where: { status: 'completed' } }),
    prisma.enrollment.count(),
  ]);
  return asRate(completed, total);
}

// students with >=1 submission this calendar month / total students
async function monthlyEngagementRate() {
  const [engagedThisMonth, totalStudents] = await Promise.all([
    distinctSubmittingUserCount({ submittedAt: { gte: monthStart() } }),
    prisma.user.count({ where: { role: ROLES.STUDENT } }),
  ]);
  return asRate(engagedThisMonth, totalStudents);
}

module.exports = { participationRate, completionRate, monthlyEngagementRate };
