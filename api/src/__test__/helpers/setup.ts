import { prisma } from '../../utils/prisma';
jest.setTimeout(10000);

beforeEach(async () => {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE organizations CASCADE;`,
    prisma.$executeRaw`TRUNCATE members CASCADE;`,
    prisma.$executeRaw`TRUNCATE timelogs CASCADE;`,
    prisma.$executeRaw`TRUNCATE activity_types CASCADE;`,
    prisma.$executeRaw`TRUNCATE users CASCADE;`,
  ]);
});
