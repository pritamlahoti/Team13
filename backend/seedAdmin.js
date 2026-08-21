const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@katalyst.com';
  const password = 'Password@123';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'System Admin',
      passwordHash: hashedPassword,
      role: 'katalyst_management',
    },
  });
  
  console.log(`Successfully created admin user: ${user.email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
