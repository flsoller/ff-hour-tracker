import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getUser } from '../services/user';
import { ErrorResponse } from '../utils/error';

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    return next(new ErrorResponse('NotAuthorized', 401));
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(new ErrorResponse('NotAuthorized', 401));
  }

  try {
    const { userId }: any = verify(
      token,
      process.env.ACCESS_TOKEN_KEY as string,
    );
    req.user = await getUser(userId);
    next();
  } catch (error) {
    return next(new ErrorResponse('NotAuthorized', 401));
  }
};

const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('NotAuthorized', 403));
    }
    next();
  };
};

export { protect, authorize };
