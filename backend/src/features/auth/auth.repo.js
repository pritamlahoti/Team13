const { query } = require('../../config/db');

const findByEmail = (email) =>
  query('SELECT * FROM users WHERE email = $1', [email]).then((r) => r.rows[0]);

const findById = (id) =>
  query('SELECT id, name, email, role, cohort_year FROM users WHERE id = $1', [id]).then(
    (r) => r.rows[0]
  );

const create = ({ name, email, passwordHash, role, cohortYear }) =>
  query(
    `INSERT INTO users (name, email, password_hash, role, cohort_year)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, cohort_year`,
    [name, email, passwordHash, role, cohortYear || null]
  ).then((r) => r.rows[0]);

module.exports = { findByEmail, findById, create };
