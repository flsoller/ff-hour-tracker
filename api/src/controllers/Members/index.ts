import { Request, Response, Router } from 'express';
import { Member } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { addMember } from '../../services/members';
import {
  ICreateMemberReq,
  IMemberCreatedRes,
} from '@hour-tracker/core-types/api/members';
import { protect } from '../../middleware/authHandler';

const createMember = asyncHandler(
  async (req: Request, res: Response<IMemberCreatedRes>) => {
    const { firstName, lastName, emailAddress }: ICreateMemberReq = req.body;

    const member: Member = await addMember(
      firstName,
      lastName,
      emailAddress,
      req.user,
    );

    res.status(201).json({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      emailAddress: member.emailAddress,
    });
  },
);

// Route definitions
const router = Router();

router.route('/').post(protect, createMember);

export default router;
