import { Request, Response, Router } from 'express';
import { ActivityType } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { addActivity, getAll } from '../../services/activities';
import {
  ICreateActivityReq,
  IActivityCreatedRes,
  IActivityType,
} from '@hour-tracker/core-types/api/activities';
import { protect } from '../../middleware/authHandler';

/**
 * Create a new activity
 */
const createActivity = asyncHandler(
  async (req: Request, res: Response<IActivityCreatedRes>) => {
    const { activityName, activityDesc }: ICreateActivityReq = req.body;

    const activityType = await addActivity(
      activityName,
      activityDesc,
      req.user,
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
    const activities: ActivityType[] = await getAll(req.user);

    res.status(200).json(activities);
  },
);

// Route definitions
const router = Router();

router.route('/').post(protect, createActivity);
router.route('/').get(protect, getAllActivities);

export default router;
