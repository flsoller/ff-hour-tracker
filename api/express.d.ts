import { IExpressReqUser } from '@hour-tracker/core-types/api/auth';

export {};
declare global {
  namespace Express {
    interface Request {
      user: IExpressReqUser;
    }
  }
}
