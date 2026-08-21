const { Router } = require('express');
const modulesService = require('./modules.service');
const { createModuleSchema } = require('./modules.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const httpError = require('../../utils/httpError');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.post(
  '/modules',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(createModuleSchema),
  async (req, res) => {
    const module = await modulesService.createModule({ ...req.body, createdBy: req.user.id });
    res.status(201).json(module);
  }
);

router.get('/modules', requireAuth, async (req, res) => {
  res.json(await modulesService.listModules());
});

router.get('/modules/:id', requireAuth, async (req, res) => {
  const module = await modulesService.getModule(req.params.id);
  if (!module) throw httpError(404, 'Module not found');
  res.json(module);
});

module.exports = router;
