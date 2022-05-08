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

export { createOrganizations };
