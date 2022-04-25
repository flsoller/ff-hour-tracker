export class ErrorResponse extends Error {
  statusCode: number;
  additionalInfo = {};

  constructor(message: string, statusCode: number, additionalInfo = {}) {
    super(message);
    this.statusCode = statusCode || 500;
    this.additionalInfo = { ...additionalInfo };
  }
}
