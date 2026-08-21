const achievementsRepo = require('./achievements.repo');
const RULES = require('./achievements.rules');

async function getUserAchievements(userId) {
  const stats = await achievementsRepo.getUserStats(userId);
  const achievements = RULES.map(({ id, name, description, check }) => ({
    id,
    name,
    description,
    earned: check(stats),
  }));
  return { userId, stats, achievements };
}

module.exports = { getUserAchievements };
