import { prisma } from '../utils/prisma';

async function addMember(
  firstName: string,
  lastName: string,
  emailAddress: string,
  organizationId: string,
) {
  return prisma.member.create({
    data: {
      firstName,
      lastName,
      emailAddress,
      orgId: organizationId,
    },
  });
}

export { addMember };
