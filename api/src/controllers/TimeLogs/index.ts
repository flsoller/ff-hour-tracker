import { Request, Response, Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { addTimelog } from '../../services/timelogs';
import {
  ICreateTimelogReq,
  ITimelogCreatedRes,
} from '@hour-tracker/core-types/api/timelogs';
import { protect } from '../../middleware/authHandler';

/**
 * Create a new time log for a specific date
 */
const createTimeLogForDate = asyncHandler(
  async (req: Request, res: Response<ITimelogCreatedRes>) => {
    const { date, hours, activityTypeId, memberId }: ICreateTimelogReq =
      req.body;

    const timeLog = await addTimelog(
      new Date(date),
      hours,
      activityTypeId,
      memberId,
      req.user,
    );

    res.status(201).json(timeLog);
  },
);

// Route definitions
const router = Router();

router.route('/').post(protect, createTimeLogForDate);

export default router;
