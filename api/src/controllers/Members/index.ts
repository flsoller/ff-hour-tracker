import { Request, Response, Router } from 'express';
import { prisma } from '../../utils/prisma';
import { Member, Organization } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';

const createMember = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, emailAddress, organizationId } = req.body;

  const organization: Organization | null =
    await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

  if (!organization) {
    throw new Error('OrganizationDoesNotExist');
  }

  const member: Member = await prisma.member.create({
    data: {
      firstName,
      lastName,
      emailAddress,
      orgId: organization.id,
    },
  });

  if (!member) {
    throw new Error('ErrorCreatingMember');
  }

  res.status(201);
});

// Route definitions
const router = Router();

router.route('/').post(createMember);

export default router;
