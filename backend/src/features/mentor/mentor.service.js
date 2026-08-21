const mentorRepo = require('./mentor.repo');
const adminService = require('../admin/admin.service');
const httpError = require('../../utils/httpError');

const listStudents = async (mentorId) => {
  const assignments = await mentorRepo.listAssignedStudents(mentorId);

  return assignments.map(({ student, assignedAt }) => ({
    ...student,
    assignedAt,
  }));
};

async function getStudent(mentorId, studentId) {
  const assignment = await mentorRepo.findAssignedStudent(mentorId, studentId);
  if (!assignment) throw httpError(404, 'Student not found');

  const progress = await adminService.getStudentProgress(studentId);
  return {
    ...assignment.student,
    assignedAt: assignment.assignedAt,
    progress,
  };
}

async function listStudentSubmissions(mentorId, studentId) {
  const assignment = await mentorRepo.findAssignedStudent(mentorId, studentId);
  if (!assignment) throw httpError(404, 'Student not found');

  return mentorRepo.listStudentSubmissions(studentId);
}

module.exports = { listStudents, getStudent, listStudentSubmissions };
