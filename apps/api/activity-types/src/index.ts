import { handleError } from "@hour-tracker/lambda-api/errorHandler";
import { NotFoundError } from "@hour-tracker/lambda-api/errors";
import { logger } from "@hour-tracker/logger";
import { APIRequest } from "./common/types/request.type";
import { getRouteHandler } from "./routes";

export const handler = async (event: APIRequest): Promise<unknown> => {
  logger.info(
    {
      event: event.requestContext,
      queryStringParameters: event.queryStringParameters,
      requestBody: event.body ?? "",
    },
    "Activity Types API handler called",
  );

  try {
    const routeHandler = getRouteHandler(
      event.requestContext.http.method,
      event.requestContext.routeKey,
    );
    if (!routeHandler) {
      logger.warn(
        { event: event.requestContext.routeKey },
        "Route handler not found",
      );
      throw new NotFoundError("RouteHandlerNotFound");
    }
    return await routeHandler(event);
  } catch (error) {
    return handleError(error);
  }
};
