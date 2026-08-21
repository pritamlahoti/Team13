// One read against the connected Prisma Postgres database. Fails loudly with
// the real error instead of a generic message, since a silent failure here
// just means every route errors out later with less context.
require('dotenv').config();
const prisma = require('../src/config/prisma');

prisma.user
  .count()
  .then((count) => {
    console.log(`✅ Connected — users table has ${count} row(s)`);
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error('❌ Prisma connection check failed:', err.message);
    process.exit(1);
  });
