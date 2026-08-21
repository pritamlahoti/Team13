// One-off bootstrap for the first katalyst_management account, since
// POST /auth/signup requires a management token to call (see auth.routes.js).
// Usage: node src/db/seed.js "Admin Name" admin@example.com password123
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.error('Usage: node src/db/seed.js <name> <email> <password>');
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 11);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role: 'katalyst_management' },
  });
  console.log(`Seeded management account: ${email}`);
  await prisma.$disconnect();
}

main();
