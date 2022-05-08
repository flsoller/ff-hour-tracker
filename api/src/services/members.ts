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

async function isMemberEmailUnique(
  emailAddress: string,
  orgId: string,
): Promise<boolean> {
  const member = await prisma.member.findFirst({
    where: {
      emailAddress,
      orgId,
    },
  });

  return !member;
}

export { addMember, isMemberEmailUnique };
