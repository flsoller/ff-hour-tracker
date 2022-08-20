import { prisma } from '../utils/prisma';
import { ErrorResponse } from '../utils/error';
import { IExpressReqUser } from '@hour-tracker/core-types/api/auth';

async function getUser(userId: string): Promise<IExpressReqUser> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      orgId: true,
      emailAddress: true,
    },
  });

  if (!user) {
    throw new ErrorResponse('ResourceNotFound', 404);
  }

  return user;
}

export { getUser };
