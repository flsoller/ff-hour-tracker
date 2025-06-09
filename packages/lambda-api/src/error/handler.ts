import { APIError } from "@hour-tracker/lambda-api/errors";
import { HttpStatusCode } from "@hour-tracker/lambda-api/httpStatus";
import { logger } from "@hour-tracker/logger";

export function handleError(error: unknown) {
  // Client error response
  if (
    error instanceof APIError
    && error.statusCode >= HttpStatusCode.BAD_REQUEST
    && error.statusCode < HttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    logger.warn({ error }, "ClientError");
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        message: error.message || "",
        details: error.details,
      }),
    };
  }

  // Internal error for all other cases
  const internalServerError = new APIError();
  logger.error({ error }, "InternalServerError");
  return {
    statusCode: internalServerError.statusCode,
    body: JSON.stringify({
      message: "API error while processing request",
      details: [],
    }),
  };
}
