// One-off script to create the single AdminUser. There is no signup endpoint.
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed
require('dotenv').config();
const prisma = require('../src/lib/prisma');
const { hashPassword } = require('../src/services/auth.service');

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running the seed script.');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
