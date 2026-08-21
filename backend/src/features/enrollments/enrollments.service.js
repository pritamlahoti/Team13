const enrollmentsRepo = require('./enrollments.repo');
const httpError = require('../../utils/httpError');

const enroll = (userId, moduleId) => enrollmentsRepo.create(userId, moduleId);

const listMyEnrollments = (userId) => enrollmentsRepo.listForUser(userId);

async function markComplete(enrollmentId, userId) {
  const enrollment = await enrollmentsRepo.findById(enrollmentId);
  if (!enrollment || enrollment.userId !== userId) {
    throw httpError(404, 'Enrollment not found');
  }
  return enrollmentsRepo.markCompleted(enrollmentId);
}

module.exports = { enroll, listMyEnrollments, markComplete };
