const reportsRepo = require('./reports.repo');

const generateReport = (filters) => reportsRepo.queryScores(filters);

module.exports = { generateReport };
