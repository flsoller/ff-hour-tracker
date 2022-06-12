import { Request, Response, Router } from 'express';
import { ActivityType, Organization } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { ErrorResponse } from '../../utils/error';
import { getOrganizationById } from '../../services/organizations';
import { addActivity, getAll } from '../../services/activities';
import {
  ICreateActivityReq,
  IActivityCreatedRes,
  IActivityType,
} from '@hour-tracker/core-types/api/activities';

/**
 * Create a new activity
 */
const createActivity = asyncHandler(
  async (req: Request, res: Response<IActivityCreatedRes>) => {
    const { activityName, activityDesc, organizationId }: ICreateActivityReq =
      req.body;

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

    res.status(201).json({
      id: activityType.id,
      activityName: activityType.activityName,
      activityDesc: activityType.activityDesc,
    });
  },
);

/**
 * Get all activities for an organization
 */
const getAllActivities = asyncHandler(
  async (req: Request, res: Response<IActivityType[]>) => {
    const activities: ActivityType[] = await getAll(req.params.id);

    res.status(200).json(activities);
  },
);

// Route definitions
const router = Router();

router.route('/').post(createActivity);
router.route('/:id').get(getAllActivities);

export default router;
