const { query } = require('../../config/db');

const create = ({ type, classification, scoringMode, dueDate, createdBy }) =>
  query(
    `INSERT INTO modules (type, classification, scoring_mode, due_date, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [type, classification, scoringMode, dueDate || null, createdBy]
  ).then((r) => r.rows[0]);

const findById = (id) => query('SELECT * FROM modules WHERE id = $1', [id]).then((r) => r.rows[0]);

const list = () => query('SELECT * FROM modules ORDER BY created_at DESC').then((r) => r.rows);

module.exports = { create, findById, list };
