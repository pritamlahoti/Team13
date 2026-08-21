const { query } = require('../../config/db');

// Filter fields per main PRD open question #9 — student, activity type, and
// date range are implemented; team/score-range filters are P1 (teams table).
function queryScores({ userId, moduleType, dateFrom, dateTo }) {
  const conditions = [];
  const params = [];

  if (userId) {
    params.push(userId);
    conditions.push(`s.user_id = $${params.length}`);
  }
  if (moduleType) {
    params.push(moduleType);
    conditions.push(`m.type = $${params.length}`);
  }
  if (dateFrom) {
    params.push(dateFrom);
    conditions.push(`xl.created_at >= $${params.length}`);
  }
  if (dateTo) {
    params.push(dateTo);
    conditions.push(`xl.created_at <= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return query(
    `SELECT s.user_id, m.type AS module_type, xl.xp_awarded, xl.scored_by, xl.created_at
     FROM xp_ledger xl
     JOIN submissions s ON s.id = xl.submission_id
     JOIN modules m ON m.id = s.module_id
     ${where}
     ORDER BY xl.created_at DESC`,
    params
  ).then((r) => r.rows);
}

module.exports = { queryScores };
