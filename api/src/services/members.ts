import { Member } from '@prisma/client';
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

async function getMemberById(
  memberId: string,
  orgId: string,
): Promise<Member | null> {
  return prisma.member.findFirst({
    where: {
      id: memberId,
      orgId,
    },
  });
}

export { addMember, isMemberEmailUnique, getMemberById };
