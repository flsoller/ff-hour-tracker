import { Request, Response, Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { getRefreshToken, registerUser, userSignIn } from '../../services/auth';
import {
  IReqRefreshToken,
  IUserCreated,
} from '@hour-tracker/core-types/api/auth';
import { authorize, protect } from '../../middleware/authHandler';
import { ROLES } from '@hour-tracker/core-constants/roles';

/**
 * Registration endpoint
 */
const register = asyncHandler(
  async (req: Request, res: Response<IUserCreated>) => {
    const { emailAddress } = await registerUser(req.body);
    res.status(201).json({ emailAddress });
  },
);

/**
 * User sign in
 */
const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await userSignIn(req.body);
  res.cookie('rtc', refreshToken, { httpOnly: true });
  res.status(200).json({ accessToken });
});

/**
 * Route for getting a new refresh token
 */
const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { grant_type }: IReqRefreshToken = req.body;
  const { accessToken } = await getRefreshToken(req.cookies.rtc, grant_type);
  res.status(200).json({ accessToken });
});

// Route definitions
const router = Router();

router.route('/register').post(protect, authorize(ROLES.ADMIN), register);
router.route('/signin').post(signIn);
router.route('/refresh-token').post(refreshToken);

export default router;
