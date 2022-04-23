import { Request, Response, Router } from 'express';
import { prisma } from '../../utils/prisma';
import asyncHandler from '../../utils/asyncHandler';

const getAll = asyncHandler(async (req: Request, res: Response) => {
  const orgs = await prisma.organization.findMany();
  res.json('Hello from orgs');
});

// Route definitions
const router = Router();

router.route('/').get(getAll);

export default router;
