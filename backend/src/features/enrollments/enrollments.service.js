const enrollmentsRepo = require('./enrollments.repo');

const enroll = (userId, moduleId) => enrollmentsRepo.create(userId, moduleId);

const listMyEnrollments = (userId) => enrollmentsRepo.listForUser(userId);

async function markComplete(enrollmentId, userId) {
  const enrollment = await enrollmentsRepo.findById(enrollmentId);
  if (!enrollment || enrollment.user_id !== userId) {
    const err = new Error('Enrollment not found');
    err.status = 404;
    throw err;
  }
  return enrollmentsRepo.markCompleted(enrollmentId);
}

module.exports = { enroll, listMyEnrollments, markComplete };
