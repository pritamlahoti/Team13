const { query } = require('../../config/db');

const create = (userId, moduleId) =>
  query(
    `INSERT INTO enrollments (user_id, module_id, status)
     VALUES ($1, $2, 'enrolled')
     RETURNING *`,
    [userId, moduleId]
  ).then((r) => r.rows[0]);

const findById = (id) => query('SELECT * FROM enrollments WHERE id = $1', [id]).then((r) => r.rows[0]);

const listForUser = (userId) =>
  query('SELECT * FROM enrollments WHERE user_id = $1', [userId]).then((r) => r.rows);

const markCompleted = (id) =>
  query(`UPDATE enrollments SET status = 'completed' WHERE id = $1 RETURNING *`, [id]).then(
    (r) => r.rows[0]
  );

module.exports = { create, findById, listForUser, markCompleted };
