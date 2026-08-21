const { Router } = require('express');
const mentorController = require('./mentor.controller');
const { studentParamsSchema } = require('./mentor.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { ROLES } = require('../../constants/roles');

const router = Router();
const requireMentor = [requireAuth, requireRole(ROLES.MENTOR)];

router.get('/api/mentor/students', ...requireMentor, mentorController.listStudents);

router.get(
  '/api/mentor/students/:studentId',
  ...requireMentor,
  validate(studentParamsSchema, 'params'),
  mentorController.getStudent
);

router.get(
  '/api/mentor/students/:studentId/submissions',
  ...requireMentor,
  validate(studentParamsSchema, 'params'),
  mentorController.listStudentSubmissions
);

module.exports = router;
