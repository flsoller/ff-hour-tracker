import { Request, Response, Router } from 'express';
import { Member } from '@prisma/client';
import asyncHandler from '../../utils/asyncHandler';
import { addMember, getMembers } from '../../services/members';
import {
  ICreateMemberReq,
  IMemberCreatedRes,
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
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

const getMembersPaginated = asyncHandler(
  async (
    req: Request<unknown, unknown, unknown, IGetMembersPaginatedReq>,
    res: Response<IGetMembersPaginatedRes>,
  ) => {
    const { limit = '10', offset = '0', order = 'asc' } = req.query;

    const { data, totalCount } = await getMembers(
      parseInt(limit, 10),
      parseInt(offset, 10),
      order,
      req.user,
    );
    res.status(200).json({ data, totalCount });
  },
);

// Route definitions
const router = Router();

router.route('/').get(protect, getMembersPaginated);
router.route('/').post(protect, createMember);

export default router;
