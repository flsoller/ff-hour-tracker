import { BadRequestError, NotFoundError } from "@hour-tracker/lambda-api/errors";
import { getById } from "../../../../common/repository/activity-type";
import { APIRequest } from "../../../../common/types/request.type";

/**
 * Verifies the request is valid for updating active status of
 * activity types
 * @param organizationId
 * @param request
 * @returns
 */
export async function validateDeactivationRequest(organizationId: string, request: APIRequest) {
  const id = request.pathParameters?.id;
  if (!id) {
    throw new BadRequestError("MissingActivityId");
  }

  const activityId = await getById(organizationId, id);
  if (!activityId) {
    throw new NotFoundError();
  }

  const { active } = JSON.parse(request.body ?? "");
  if (typeof active !== "boolean") {
    throw new BadRequestError("InvalidRequest");
  }

  return { id, active };
}
