const { Router } = require('express');
const enrollmentsService = require('./enrollments.service');
const { createEnrollmentSchema } = require('./enrollments.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.post(
  '/enrollments',
  requireAuth,
  requireRole(ROLES.STUDENT),
  validate(createEnrollmentSchema),
  async (req, res) => {
    const { moduleId } = req.body;
    res.status(201).json(await enrollmentsService.enroll(req.user.id, moduleId));
  }
);

router.get('/enrollments', requireAuth, async (req, res) => {
  res.json(await enrollmentsService.listMyEnrollments(req.user.id));
});

router.patch('/enrollments/:id/complete', requireAuth, requireRole(ROLES.STUDENT), async (req, res) => {
  res.json(await enrollmentsService.markComplete(req.params.id, req.user.id));
});

module.exports = router;
