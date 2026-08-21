const { Router } = require('express');
const enrollmentsService = require('./enrollments.service');
const { requireAuth } = require('../../middleware/auth');

const router = Router();

router.post('/enrollments', requireAuth, async (req, res) => {
  const { moduleId } = req.body;
  res.status(201).json(await enrollmentsService.enroll(req.user.id, moduleId));
});

router.get('/enrollments', requireAuth, async (req, res) => {
  res.json(await enrollmentsService.listMyEnrollments(req.user.id));
});

router.patch('/enrollments/:id/complete', requireAuth, async (req, res) => {
  res.json(await enrollmentsService.markComplete(req.params.id, req.user.id));
});

module.exports = router;
