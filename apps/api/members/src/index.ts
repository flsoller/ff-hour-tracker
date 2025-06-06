import { handleError } from "@hour-tracker/lambda-api/errorHandler";
import { NotFoundError } from "@hour-tracker/lambda-api/errors";
import { getRouteHandler } from "./routes";
import { APIRequest } from "./common/types/request.type";

export const handler = async (event: APIRequest): Promise<unknown> => {
  console.log(event);

  try {
    const routeHandler = getRouteHandler(event.routeKey);
    if (!routeHandler) {
      throw new NotFoundError();
    }
    return await routeHandler(event);
  } catch (error) {
    return handleError(error);
  }
};
