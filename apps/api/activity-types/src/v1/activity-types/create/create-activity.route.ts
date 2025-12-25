import { APIError } from "@hour-tracker/lambda-api/errors";
import { create } from "../../../common/repository/activity-type";
import { APIRequest } from "../../../common/types/request.type";
import { validateRequest } from "../../../common/utils/validators";

/**
 * Creates an activity type
 * @param request - The API request
 * @returns
 */
export async function createActivityType(request: APIRequest) {
  const organizationId = request.requestContext.authorizer.lambda.organizationId;
  const { activityName, activityDescription, colorCode } = await validateRequest(request);
  const [activityType] = await create(organizationId, activityName, activityDescription, colorCode);

  if (!activityType) {
    throw new APIError("FailedToCreateActivity");
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: activityType.id,
      activityName: activityType.activityName,
      activityDescription: activityType.activityDescription,
      colorCode: activityType.colorCode,
    }),
  };
}
