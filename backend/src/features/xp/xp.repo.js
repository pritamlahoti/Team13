const { query } = require('../../config/db');

// xp_ledger is append-only (PRD section 9); "yearly" XP is summed from
// created_at since submissions/modules carry no explicit programme year yet.
const sumForUserYear = (userId, year) =>
  query(
    `SELECT COALESCE(SUM(xl.xp_awarded), 0) AS total_xp
     FROM xp_ledger xl
     JOIN submissions s ON s.id = xl.submission_id
     WHERE s.user_id = $1 AND EXTRACT(YEAR FROM xl.created_at) = $2`,
    [userId, year]
  ).then((r) => Number(r.rows[0].total_xp));

const listForUser = (userId) =>
  query(
    `SELECT xl.* FROM xp_ledger xl
     JOIN submissions s ON s.id = xl.submission_id
     WHERE s.user_id = $1
     ORDER BY xl.created_at DESC`,
    [userId]
  ).then((r) => r.rows);

module.exports = { sumForUserYear, listForUser };
