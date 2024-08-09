import {
  APIError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from './error/errors';
import { handleError } from './error/handler';
import { HttpStatusCode } from './http/status.constant';

export const errors = {
  APIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};

export const handlers = {
  handleError,
};

export const httpStatus = {
  HttpStatusCode,
};
