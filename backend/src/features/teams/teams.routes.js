const { Router } = require('express');
const teamsService = require('./teams.service');
const { createTeamSchema, addTeamMemberSchema } = require('./teams.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const httpError = require('../../utils/httpError');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.post(
  '/teams',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(createTeamSchema),
  async (req, res) => {
    res.status(201).json(await teamsService.createTeam(req.body.name));
  }
);

router.post(
  '/teams/:id/members',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(addTeamMemberSchema),
  async (req, res) => {
    res.status(201).json(await teamsService.addMember(req.params.id, req.body.userId));
  }
);

router.get('/teams/:id', requireAuth, async (req, res) => {
  const team = await teamsService.getTeam(req.params.id);
  if (!team) throw httpError(404, 'Team not found');
  res.json(team);
});

module.exports = router;
