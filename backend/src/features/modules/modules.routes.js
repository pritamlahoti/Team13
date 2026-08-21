const { Router } = require('express');
const modulesService = require('./modules.service');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = Router();

router.post('/modules', requireAuth, requireRole('katalyst_management'), async (req, res) => {
  const { type, classification, scoringMode, dueDate } = req.body;
  const module = await modulesService.createModule({
    type,
    classification,
    scoringMode,
    dueDate,
    createdBy: req.user.id,
  });
  res.status(201).json(module);
});

router.get('/modules', requireAuth, async (req, res) => {
  res.json(await modulesService.listModules());
});

router.get('/modules/:id', requireAuth, async (req, res) => {
  const module = await modulesService.getModule(req.params.id);
  if (!module) return res.status(404).json({ error: 'Module not found' });
  res.json(module);
});

module.exports = router;
