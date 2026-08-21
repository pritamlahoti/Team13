const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const query = (text, params) => pool.query(text, params);

// Runs fn(client) inside a transaction; used wherever a review + xp_ledger
// write must land together (see backend PRD section 8, "XP integrity").
async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, withTransaction };
