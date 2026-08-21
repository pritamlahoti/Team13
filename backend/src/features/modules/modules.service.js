const modulesRepo = require('./modules.repo');

// Validation (mandatory-needs-dueDate, scoringMode default) lives in
// modules.schema.js — this is a pure pass-through to the repo.
const createModule = (data) => modulesRepo.create(data);
const getModule = (id) => modulesRepo.findById(id);
const listModules = () => modulesRepo.list();

module.exports = { createModule, getModule, listModules };
