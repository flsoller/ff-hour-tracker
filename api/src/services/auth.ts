import { prisma } from '../utils/prisma';
import {
  IRefreshTokenSuccess,
  IRegisterUser,
  ISignIn,
  ISignInSuccess,
} from '@hour-tracker/core-types/api/auth';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { ErrorResponse } from '../utils/error';
import { sign, verify } from 'jsonwebtoken';
import { getUser } from './user';
import { API_GRANT_TYPES } from '@hour-tracker/core-constants/shared';

async function registerUser({
  emailAddress,
  password,
  name,
  orgId,
  role,
}: IRegisterUser): Promise<User> {
  const hashedPassword = await hash(password, 12);

  return prisma.user.create({
    data: {
      emailAddress,
      name,
      orgId,
      password: hashedPassword,
      role,
    },
  });
}

async function userSignIn({
  emailAddress,
  password,
}: ISignIn): Promise<ISignInSuccess> {
  const user = await prisma.user.findFirst({
    where: {
      emailAddress,
    },
  });

  if (!user) {
    throw new ErrorResponse('InvalidInformation', 400);
  }

  const validCreds = await compare(password, user.password);

  if (!validCreds) {
    throw new ErrorResponse('InvalidInformation', 400);
  }

  return {
    accessToken: createAccessToken(user.id),
    refreshToken: createRefreshToken(user.id),
  };
}

// Create access token with user information
function createAccessToken(userId: string) {
  return sign(
    {
      userId,
    },
    process.env.ACCESS_TOKEN_KEY as string,
    { expiresIn: '15m' },
  );
}

// Create refresh token with user information
function createRefreshToken(userId: string) {
  return sign(
    {
      userId,
    },
    process.env.REFRESH_TOKEN_KEY as string,
    { expiresIn: '1d' },
  );
}

async function getRefreshToken(
  token: string,
  grantType: string,
): Promise<IRefreshTokenSuccess> {
  let payload: any = null;

  if (!token) {
    throw new ErrorResponse('MissingInformation', 400);
  }

  if (API_GRANT_TYPES.REFRESH_TOKEN !== grantType) {
    throw new ErrorResponse('MissingInformation', 400);
  }

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_KEY as string);
  } catch (error) {
    throw new ErrorResponse('InvalidInformation', 401);
  }

  const user = await getUser(payload.userId);

  return {
    accessToken: createAccessToken(user.id),
  };
}

export { registerUser, userSignIn, getRefreshToken, createAccessToken };
