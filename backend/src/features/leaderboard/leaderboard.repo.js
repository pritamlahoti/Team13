const prisma = require('../../config/prisma');
const { ROLES } = require('../../constants/roles');

function yearRange(year) {
  if (!year) return undefined;
  return { gte: new Date(`${year}-01-01T00:00:00.000Z`), lt: new Date(`${year + 1}-01-01T00:00:00.000Z`) };
}

// ponytail: grouping happens in JS over all matching xp_ledger rows rather
// than a SQL GROUP BY (xp_ledger has no user_id/team_id column of its own,
// only via submission) — fine at hackathon scale, switch to a raw grouped
// query if the ledger grows large enough for this to matter.
async function individualLeaderboard({ limit, year }) {
  const rows = await prisma.xpLedger.findMany({
    where: { createdAt: yearRange(year), submission: { user: { role: ROLES.STUDENT } } },
    select: { xpAwarded: true, submission: { select: { user: { select: { id: true, name: true } } } } },
  });

  const totals = new Map();
  for (const row of rows) {
    const { id, name } = row.submission.user;
    const entry = totals.get(id) || { userId: id, name, totalXp: 0 };
    entry.totalXp += row.xpAwarded;
    totals.set(id, entry);
  }

  return rankAndTrim(totals, limit);
}

async function teamLeaderboard({ limit, year }) {
  const rows = await prisma.xpLedger.findMany({
    where: { createdAt: yearRange(year), submission: { teamId: { not: null } } },
    select: { xpAwarded: true, submission: { select: { team: { select: { id: true, name: true } } } } },
  });

  const totals = new Map();
  for (const row of rows) {
    const { id, name } = row.submission.team;
    const entry = totals.get(id) || { teamId: id, name, totalXp: 0 };
    entry.totalXp += row.xpAwarded;
    totals.set(id, entry);
  }

  return rankAndTrim(totals, limit);
}

function rankAndTrim(totals, limit) {
  return [...totals.values()]
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, limit)
    .map((entry, i) => ({ rank: i + 1, ...entry }));
}

module.exports = { individualLeaderboard, teamLeaderboard };
