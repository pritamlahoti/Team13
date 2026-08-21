const prisma = require('../../config/prisma');

async function getDashboardStats() {
  const [
    studentsTotal,
    mentorsTotal,
    modulesTotal,
    modulesOverdue,
    xpLedgers
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'student' } }),
    prisma.user.count({ where: { role: 'katalyst_management' } }), // Assuming katalyst_management acts as mentor
    prisma.module.count(),
    prisma.module.count({ where: { dueDate: { lt: new Date() } } }),
    prisma.xpLedger.aggregate({ _sum: { xpAwarded: true } })
  ]);

  return {
    studentsTotal,
    studentsActive: studentsTotal, // No status on user model in Prisma
    studentsInactive: 0,
    mentorsTotal,
    activitiesTotal: modulesTotal,
    activitiesActive: modulesTotal,
    activitiesOverdue: modulesOverdue,
    totalXp: xpLedgers._sum.xpAwarded || 0
  };
}

async function listActivities(where, orderBy, skip, take) {
  const [total, data] = await prisma.$transaction([
    prisma.module.count({ where }),
    prisma.module.findMany({ where, orderBy, skip, take, include: { _count: { select: { enrollments: true, submissions: true } } } })
  ]);
  return { total, data };
}

async function getActivity(id) {
  return prisma.module.findUnique({
    where: { id },
    include: { _count: { select: { enrollments: true, submissions: true } } }
  });
}

async function createActivity(data, createdBy) {
  const { type, classification, scoringMode, dueDate } = data;
  return prisma.module.create({
    data: {
      type: type || 'session',
      classification: classification || 'mandatory',
      scoringMode: scoringMode || 'subjective',
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy
    }
  });
}

async function updateActivity(id, data) {
  const { type, classification, scoringMode, dueDate } = data;
  return prisma.module.update({
    where: { id },
    data: {
      ...(type && { type }),
      ...(classification && { classification }),
      ...(scoringMode && { scoringMode }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    }
  });
}

async function updateActivityStatus(id, status) {
  return prisma.module.findUnique({ where: { id } });
}

async function listStudents(where, orderBy, skip, take) {
  const [total, data] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        cohortYear: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            submissions: true,
            notifications: true
          }
        }
      }
    })
  ]);
  return { total, data };
}

async function getStudent(id) {
  return prisma.user.findFirst({
    where: { id, role: 'student' },
    select: {
      id: true,
      name: true,
      email: true,
      cohortYear: true,
      createdAt: true,
      submissions: {
        include: { xpLedger: true }
      }
    }
  });
}

async function getStudentProgress(id) {
  const submissions = await prisma.submission.findMany({
    where: { userId: id },
    orderBy: { submittedAt: 'desc' },
    take: 10,
    include: { xpLedger: true }
  });
  
  const xpTransactions = await prisma.xpLedger.findMany({
    where: { submission: { userId: id } },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return {
    recent_xp: xpTransactions,
    recent_submissions: submissions
  };
}

async function listMentors(where, orderBy, skip, take) {
  const [total, data] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        cohortYear: true,
        createdAt: true
      }
    })
  ]);
  return { total, data };
}

async function getAnalyticsOverview(filters = {}) {
  const [totalStudents, totalMentors, modules, xpSum] = await Promise.all([
    prisma.user.count({ where: { role: 'student' } }),
    prisma.user.count({ where: { role: 'katalyst_management' } }),
    prisma.module.count(),
    prisma.xpLedger.aggregate({ _sum: { xpAwarded: true } })
  ]);
  
  return {
    total_students: totalStudents,
    total_mentors: totalMentors,
    total_xp: xpSum._sum.xpAwarded || 0,
    active_activities: modules
  };
}

async function getAtRiskStudents() {
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    include: {
      submissions: {
        orderBy: { submittedAt: 'desc' },
        take: 1
      }
    }
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const atRisk = students.filter(student => {
    if (student.submissions.length === 0) return true; // Never submitted
    return new Date(student.submissions[0].submittedAt) < sevenDaysAgo;
  });

  return atRisk.map(student => ({
    studentId: student.id,
    studentName: student.name,
    lastActivity: student.submissions.length > 0 ? student.submissions[0].submittedAt : null,
    riskLevel: 'at_risk'
  }));
}

module.exports = {
  getDashboardStats,
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  updateActivityStatus,
  listStudents,
  getStudent,
  getStudentProgress,
  listMentors,
  getAnalyticsOverview,
  getAtRiskStudents
};
