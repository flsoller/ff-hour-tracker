import { IExpressReqUser } from '@hour-tracker/core-types/api/auth';
import { Organization } from '@prisma/client';
import { ErrorResponse } from '../utils/error';
import { prisma } from '../utils/prisma';
import { getOrganizationById } from './organizations';

/**
 * Creates a new activity for an organization
 * @param activityName - name of the activity to be created
 * @param activityDesc - optional description for the activity
 * @param user - state user
 */
async function addActivity(
  activityName: string,
  activityDesc: string,
  user: IExpressReqUser,
) {
  const organization: Organization | null = await getOrganizationById(
    user.orgId,
  );

  if (!organization) {
    throw new ErrorResponse('OrganizationDoesNotExist', 400);
  }

  return prisma.activityType.create({
    data: {
      activityName,
      activityDesc,
      orgId: user.orgId,
    },
  });
}

/**
 * Returns all activities for an organization
 * @param organizationId - id of the organization
 */
async function getAll(user: IExpressReqUser) {
  return prisma.activityType.findMany({
    where: {
      orgId: user.orgId,
    },
  });
}

async function getActivityById(activityId: string, orgId: string) {
  return prisma.activityType.findFirst({
    where: {
      orgId,
      id: activityId,
    },
  });
}

export { addActivity, getAll, getActivityById };
