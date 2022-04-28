import { prisma } from '../utils/prisma';

/**
 * Returns an organization by it's id
 * @param organizationId - Id of the organization
 */
async function getOrganizationById(organizationId: string) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });
}

/**
 * Creates a new organization
 * @param name - The name of the new organization
 * @param description - An optional description, defaults to empty string
 */
async function addOrganization(name: string, description = '') {
  return prisma.organization.create({
    data: {
      name,
      description,
    },
  });
}

export { getOrganizationById, addOrganization };
