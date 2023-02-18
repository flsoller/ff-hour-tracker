import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils/error';

const errorHandler: ErrorRequestHandler = async (
  err: ErrorResponse,
  req: Request,
  res: Response,
  // Express requires 4th param to be handled as an error handler but is unused here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const error: ErrorResponse = {
    ...err,
    message: err.message || 'ServerError',
    additionalInfo: {},
    statusCode: err.statusCode || 500,
  };

  // Prisma validation error check
  if (err instanceof PrismaClientValidationError) {
    error.statusCode = 400;
    error.message = 'MissingInformation';
  }

  // Prisma unique constraint error check
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    error.statusCode = 400;
    error.message = 'UnableToCreateResource';
  }

  res.status(error.statusCode).json({
    error: error.message,
    additionalInfo: error.additionalInfo,
  });
};

export default errorHandler;
