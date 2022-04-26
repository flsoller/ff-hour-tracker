import { prisma } from '../utils/prisma';

async function getOrganizationById(organizationId: string) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });
}

export { getOrganizationById };
