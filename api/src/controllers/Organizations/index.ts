import { Request, Response, Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { addOrganization } from '../../services/organizations';

// Create a new organization
const createOrganization = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const organization = await addOrganization(name, description);

  res.status(201).json(organization);
});

// Route definitions
const router = Router();

router.route('/').post(createOrganization);

export default router;
