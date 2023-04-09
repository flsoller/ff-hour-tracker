import { IExpressReqUser } from '@hour-tracker/core-types/api/auth';
import { Member, Organization } from '@prisma/client';
import { ErrorResponse } from '../utils/error';
import { prisma } from '../utils/prisma';
import { getOrganizationById } from './organizations';
import { isTypeOfNumbers, isValidOrderQuery } from '../utils/validators';

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

async function getMembers(
  limit: number,
  offset: number,
  order: 'asc' | 'desc',
  user: IExpressReqUser,
) {
  if (!isTypeOfNumbers([limit, offset]) || !isValidOrderQuery(order)) {
    throw new ErrorResponse('InvalidQueryParams', 400);
  }

  const members = await prisma.member.findMany({
    where: {
      orgId: user.orgId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      emailAddress: true,
    },
    take: limit,
    skip: offset,
    orderBy: [
      {
        lastName: order,
      },
    ],
  });

  return {
    data: members,
    totalCount: await prisma.member.count({ where: { orgId: user.orgId } }),
  };
}

export { addMember, isMemberEmailUnique, getMemberById, getMembers };
