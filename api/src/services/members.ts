import { IExpressReqUser } from '@hour-tracker/core-types/api/auth';
import { Member, Organization } from '@prisma/client';
import { ErrorResponse } from '../utils/error';
import { prisma } from '../utils/prisma';
import { getOrganizationById } from './organizations';

async function addMember(
  firstName: string,
  lastName: string,
  emailAddress: string,
  user: IExpressReqUser,
) {
  const organization: Organization = await getOrganizationById(user.orgId);

  const emailUnique = await isMemberEmailUnique(emailAddress, organization.id);

  if (!emailUnique) {
    throw new ErrorResponse('UnableToCreateMember', 400);
  }

  return prisma.member.create({
    data: {
      firstName,
      lastName,
      emailAddress,
      orgId: organization.id,
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
