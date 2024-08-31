import { Context, APIGatewayProxyEventV2 } from "aws-lambda";
import { handleError } from "@hour-tracker/lambda-api/errorHandler";
import { NotFoundError } from "@hour-tracker/lambda-api/errors";
import { getRouteHandler, ROUTE_HANDLING_MAP } from "./routes";

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<unknown> => {
  try {
    const routeHandler = getRouteHandler(event.requestContext.routeKey);
    if (!routeHandler) {
      throw new NotFoundError();
    }
    return await routeHandler(event);
  } catch (error) {
    return handleError(error);
  }
};
