import { Request, Response, Router } from 'express';
import { ActivityType, Organization } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { ErrorResponse } from '../../utils/error';
import { getOrganizationById } from '../../services/organizations';
import { addActivity, getAll } from '../../services/activities';

/**
 * Create a new activity
 */
const createActivity = asyncHandler(async (req: Request, res: Response) => {
  const { activityName, activityDesc, organizationId } = req.body;

  const organization: Organization | null = await getOrganizationById(
    organizationId,
  );

  if (!organization) {
    throw new ErrorResponse('OrganizationDoesNotExist', 400);
  }

  const activityType: ActivityType = await addActivity(
    activityName,
    activityDesc,
    organization.id,
  );

  res.status(201).json(activityType);
});

/**
 * Get all activities for an organization
 */
const getAllActivities = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId } = req.body;

  const activities: ActivityType[] = await getAll(organizationId);

  res.status(200).json(activities);
});

// Route definitions
const router = Router();

router.route('/').get(getAllActivities).post(createActivity);

export default router;
