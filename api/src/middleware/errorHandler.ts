import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils/error';

const errorHandler: ErrorRequestHandler = async (
  err: Error,
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
    statusCode: 500,
  };

  res.status(error.statusCode).json({
    error: error.message,
    additionalInfo: error.additionalInfo,
  });
};

export default errorHandler;
