import { Context, APIGatewayProxyEventV2 } from "aws-lambda";
import { handleError } from "@hour-tracker/lambda-api/errorHandler";
import { NotFoundError } from "@hour-tracker/lambda-api/errors";
import { getRouteHandler } from "./routes";
import { logger } from "@hour-tracker/logger";

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<unknown> => {
  try {
    logger.info(
      {
        context,
        requestContext: { ...event.requestContext },
      },
      "Authenticator handler called"
    );
    const routeHandler = getRouteHandler(event.requestContext.routeKey);
    if (!routeHandler) {
      logger.warn(
        { event: event.requestContext.routeKey },
        "Route handler not found"
      );
      throw new NotFoundError();
    }
    return await routeHandler(event);
  } catch (error) {
    return handleError(error);
  }
};
