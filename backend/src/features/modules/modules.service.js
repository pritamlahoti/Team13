const modulesRepo = require('./modules.repo');

async function createModule({ type, classification, scoringMode, dueDate, createdBy }) {
  if (classification === 'mandatory' && !dueDate) {
    const err = new Error('due_date is required for mandatory modules');
    err.status = 400;
    throw err;
  }
  return modulesRepo.create({ type, classification, scoringMode, dueDate, createdBy });
}

const getModule = (id) => modulesRepo.findById(id);
const listModules = () => modulesRepo.list();

module.exports = { createModule, getModule, listModules };
