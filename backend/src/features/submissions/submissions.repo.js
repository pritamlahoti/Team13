const { query } = require('../../config/db');

const create = (userId, moduleId, contentRef) =>
  query(
    `INSERT INTO submissions (user_id, module_id, content_ref, status)
     VALUES ($1, $2, $3, 'pending')
     RETURNING *`,
    [userId, moduleId, contentRef]
  ).then((r) => r.rows[0]);

const findById = (id) => query('SELECT * FROM submissions WHERE id = $1', [id]).then((r) => r.rows[0]);

const listPending = () =>
  query(`SELECT * FROM submissions WHERE status = 'pending' ORDER BY submitted_at`).then(
    (r) => r.rows
  );

const markPending = (id) =>
  query(`UPDATE submissions SET status = 'pending' WHERE id = $1 RETURNING *`, [id]).then(
    (r) => r.rows[0]
  );

module.exports = { create, findById, listPending, markPending };
