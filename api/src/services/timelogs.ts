import { ErrorResponse } from '../utils/error';
import { prisma } from '../utils/prisma';
import { getActivityById } from './activities';
import { getMemberById } from './members';

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
  const member = await getMemberById(memberId, organizationId);

  if (!member) {
    throw new ErrorResponse('MemberNotFound', 400);
  }

  const activity = await getActivityById(activityTypeId, organizationId);

  if (!activity) {
    throw new ErrorResponse('ActivityNotFound', 400);
  }

  const timelog = await prisma.timeLog.create({
    data: {
      date,
      hours,
      activityTypeId: activity.id,
      memberId,
      orgId: organizationId,
    },
  });

  return {
    memberName: `${member.firstName} ${member.lastName}`,
    hours: timelog.hours,
    activity: activity.activityName,
    date: timelog.date,
  };
}

export { addTimelog };
