import { APIError, BadRequestError, NotFoundError } from "@hour-tracker/lambda-api/errors";
import { getById, updateById } from "../../../../common/repository/activity-type";
import { APIRequest } from "../../../../common/types/request.type";
import { validateRequest } from "../../../../common/utils/validators";

export async function updateActivityType(request: APIRequest) {
  const organizationId = request.requestContext.authorizer.lambda.organizationId;

  const id = request.pathParameters?.id;
  if (!id) {
    throw new BadRequestError("MissingActivityId");
  }

  const activityId = await getById(organizationId, id);
  if (!activityId) {
    throw new NotFoundError();
  }

  const { activityName, activityDescription, colorCode } = await validateRequest(request, activityId);

  const [updatedActivity] = await updateById(activityId, activityName, activityDescription, colorCode);
  if (!updatedActivity) {
    throw new APIError("FailedToUpdateActivity");
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: updatedActivity.id,
      activityName: updatedActivity.activityName,
      activityDescription: updatedActivity.activityDescription,
      colorCode: updatedActivity.colorCode,
    }),
  };
}
