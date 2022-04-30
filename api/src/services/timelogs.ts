import { prisma } from '../utils/prisma';

/**
 * Creates a new activity for an organization
 * @param date - date the timelog should be linked to
 * @param hours - number of hours for the timelog
 * @param activityTypeId - type of activity for the timelog
 * @param memberId - member this timelog belongs to
 * @param organizationId - organization this timelog belongs to
 */
async function addTimelog(
  date: Date,
  hours: number,
  activityTypeId: string,
  memberId: string,
  organizationId: string,
) {
  return prisma.timeLog.create({
    data: {
      date,
      hours,
      activityTypeId,
      memberId,
      orgId: organizationId,
    },
  });
}

export { addTimelog };
