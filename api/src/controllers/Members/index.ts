import { Request, Response, Router } from 'express';
import { Member, Organization } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { ErrorResponse } from '../../utils/error';
import { getOrganizationById } from '../../services/organizations';
import { addMember, isMemberEmailUnique } from '../../services/members';

const createMember = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, emailAddress, organizationId } = req.body;

  const organization: Organization | null = await getOrganizationById(
    organizationId,
  );

  if (!organization) {
    throw new ErrorResponse('OrganizationDoesNotExist', 400);
  }

  const emailUnique = await isMemberEmailUnique(emailAddress, organization.id);

  if (!emailUnique) {
    throw new ErrorResponse('UnableToCreateMember', 400);
  }

  const member: Member | null = await addMember(
    firstName,
    lastName,
    emailAddress,
    organization.id,
  );

  res.status(201).json({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    emailAddress: member.emailAddress,
    organization: organization.name,
  });
});

// Route definitions
const router = Router();

router.route('/').post(createMember);

export default router;
