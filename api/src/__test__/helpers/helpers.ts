import { prisma } from '../../utils/prisma';
import { registerUser, createAccessToken } from '../../services/auth';
import { IRegisterUser } from '@hour-tracker/core-types/api/auth';
import { Role } from '@prisma/client';

async function createOrganizations() {
  const organization = await prisma.organization.create({
    data: {
      name: 'organization',
      description: 'organization description',
    },
  });

  const otherOrganization = await prisma.organization.create({
    data: {
      name: 'otherOrganization',
      description: 'otherOrganization description',
    },
  });

  return [organization, otherOrganization];
}

async function createMemberForOrganization(
  orgId: string,
  emailAddress = 'test@mail.com',
  firstName = 'Test',
  lastName = 'User',
) {
  return prisma.member.create({
    data: {
      firstName,
      lastName,
      emailAddress,
      orgId,
    },
  });
}

async function createUserForOrganization(orgId: string, options = {}) {
  const params: IRegisterUser = {
    emailAddress: 'testuser@db.com',
    password: '12345',
    name: 'Mr. Test',
    orgId,
    role: Role.USER,
    ...options,
  };

  return registerUser(params);
}

function loginTestUser(userId: string): string {
  return createAccessToken(userId);
}

export {
  createOrganizations,
  createMemberForOrganization,
  createUserForOrganization,
  loginTestUser,
};
