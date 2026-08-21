const prisma = require('../../config/prisma');

const STUDENT_FIELDS = {
  id: true,
  name: true,
  email: true,
  cohortYear: true,
};

const listAssignedStudents = (mentorId) =>
  prisma.mentorAssignment.findMany({
    where: {
      mentorId,
      active: true,
      student: { role: 'student' },
    },
    select: {
      assignedAt: true,
      student: { select: STUDENT_FIELDS },
    },
    orderBy: { assignedAt: 'desc' },
  });

const findAssignedStudent = (mentorId, studentId) =>
  prisma.mentorAssignment.findFirst({
    where: {
      mentorId,
      studentId,
      active: true,
      student: { role: 'student' },
    },
    select: {
      assignedAt: true,
      student: { select: STUDENT_FIELDS },
    },
  });

const listStudentSubmissions = (studentId) =>
  prisma.submission.findMany({
    where: { userId: studentId },
    orderBy: { submittedAt: 'desc' },
    include: {
      module: true,
      reviews: {
        orderBy: { reviewedAt: 'desc' },
        include: {
          reviewer: { select: { id: true, name: true, role: true } },
        },
      },
      xpLedger: true,
    },
  });

module.exports = {
  listAssignedStudents,
  findAssignedStudent,
  listStudentSubmissions,
};
