import { Request, Response, Router } from 'express';
import { TimeLog } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { addTimelog } from '../../services/timelogs';

/**
 * Create a new time log for a specific date
 */
const createTimeLogForDate = asyncHandler(
  async (req: Request, res: Response) => {
    const { date, hours, activityTypeId, memberId, organizationId } = req.body;

    const timeLog: TimeLog = await addTimelog(
      new Date(Date.parse(date)),
      parseInt(hours),
      activityTypeId,
      memberId,
      organizationId,
    );

    res.status(201).json(timeLog);
  },
);

// Route definitions
const router = Router();

router.route('/').post(createTimeLogForDate);

export default router;
