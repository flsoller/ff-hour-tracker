/**
 * error type with http status code and properties
 * as returned from api
 */
export type Error = {
  statusCode: number;
  error: string;
  additionalInfo: object;
};
