import { Context, APIGatewayProxyEventV2 } from "aws-lambda";
import { handlers } from "@hour-tracker/lambda-api";
import { ROUTE_HANDLING_MAP } from "./routes";

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<unknown> => {
  try {
    return await ROUTE_HANDLING_MAP[event.requestContext.routeKey](event);
  } catch (error) {
    return handlers.handleError(error);
  }
};
