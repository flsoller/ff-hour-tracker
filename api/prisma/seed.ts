import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await hash(process.env.ADMIN_USER_PW as string, 12);
  const organization = await prisma.organization.create({
    data: {
      name: 'AdminOrg',
      description: 'Account Management Org',
    },
  });
  await prisma.user.create({
    data: {
      orgId: organization.id,
      emailAddress: process.env.ADMIN_USER_EMAIL as string,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
