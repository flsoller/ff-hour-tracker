import { Request, Response, Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { addOrganization } from '../../services/organizations';
import {
  ICreateOrganizationReq,
  IOrganizationCreatedRes,
} from '@hour-tracker/core-types/api/organization';

// Create a new organization
const createOrganization = asyncHandler(
  async (req: Request, res: Response<IOrganizationCreatedRes>) => {
    const { name, description }: ICreateOrganizationReq = req.body;
    const organization = await addOrganization(name, description);

    res.status(201).json({
      id: organization.id,
      name: organization.name,
    });
  },
);

// Route definitions
const router = Router();

router.route('/').post(createOrganization);

export default router;
