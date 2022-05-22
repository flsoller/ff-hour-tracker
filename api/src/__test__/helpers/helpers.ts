import { prisma } from '../../utils/prisma';

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

export { createOrganizations, createMemberForOrganization };
