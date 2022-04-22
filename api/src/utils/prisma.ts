import { PrismaClient } from '@prisma/client';

// Declare prisma on global object to avoid implicit any error
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Instantiate a single instance of prisma
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
