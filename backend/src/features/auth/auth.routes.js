const { Router } = require('express');
const authService = require('./auth.service');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = Router();

// Account provisioning is admin-only per backend PRD section 3's open-question
// recommendation — flip to public signup only if the team confirms otherwise.
router.post('/auth/signup', requireAuth, requireRole('katalyst_management'), async (req, res) => {
  const { name, email, password, role, cohortYear } = req.body;
  const result = await authService.signup({ name, email, password, role, cohortYear });
  res.status(201).json(result);
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
});

router.get('/auth/me', requireAuth, async (req, res) => {
  const user = await authService.me(req.user.id);
  res.json(user);
});

module.exports = router;
