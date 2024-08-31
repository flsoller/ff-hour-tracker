export enum HttpStatusCode {
  // Successful Responses
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,

  // Client Error Responses
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  // Internal
  INTERNAL_SERVER_ERROR = 500,
}
