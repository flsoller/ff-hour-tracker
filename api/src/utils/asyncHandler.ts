import { NextFunction, Request, Response } from 'express';

// asyncHandler to avoid repeating try/catch on every async/await controller method.
const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
