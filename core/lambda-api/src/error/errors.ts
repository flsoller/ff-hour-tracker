import { HttpStatusCode } from '../http/status.constant';

export class APIError extends Error {
  statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  details: [] = [];
}

export class BadRequestError extends APIError {
  statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST;
}

export class UnauthorizedError extends APIError {
  statusCode: HttpStatusCode = HttpStatusCode.UNAUTHORIZED;
}

export class ForbiddenError extends APIError {
  statusCode: HttpStatusCode = HttpStatusCode.FORBIDDEN;
}

export class NotFoundError extends APIError {
  statusCode: HttpStatusCode = HttpStatusCode.NOT_FOUND;
}
