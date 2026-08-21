const xpRepo = require('./xp.repo');

const getYearlyXp = (userId, year = new Date().getFullYear()) =>
  xpRepo.sumForUserYear(userId, year).then((totalXp) => ({ userId, year, totalXp }));

const getLedger = (userId) => xpRepo.listForUser(userId);

module.exports = { getYearlyXp, getLedger };
