import { prisma } from '../utils/prisma';

/**
 * Creates a new activity for an organization
 * @param activityName - name of the activity to be created
 * @param activityDesc - optional description for the activity
 * @param organizationId - id of the organization
 */
async function addActivity(
  activityName: string,
  activityDesc: string,
  organizationId: string,
) {
  return prisma.activityType.create({
    data: {
      activityName,
      activityDesc,
      orgId: organizationId,
    },
  });
}

/**
 * Returns all activities for an organization
 * @param organizationId - id of the organization
 */
async function getAll(organizationId: string) {
  return prisma.activityType.findMany({
    where: {
      orgId: organizationId,
    },
  });
}

export { addActivity, getAll };
