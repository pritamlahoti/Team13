const xpRepo = require('./xp.repo');

const getYearlyXp = (userId, year = new Date().getFullYear()) =>
  xpRepo.sumForUserYear(userId, year).then((totalXp) => ({ userId, year, totalXp }));

const getLedger = (userId, pagination) => xpRepo.listForUser(userId, pagination);

module.exports = { getYearlyXp, getLedger };
