import { BadRequestError } from "@hour-tracker/lambda-api/errors";
import { getByName } from "../../../common/repository/activity-type";
import { APIRequest } from "../../../common/types/request.type";

/**
 * Verifies that activity name does not already exist
 * @param organizationId
 * @param name
 */
export async function isActivityTypeUnique(
  organizationId: string,
  name: string,
) {
  const existingActivity = await getByName(organizationId, name);

  if (existingActivity) {
    throw new BadRequestError("ActivityAlreadyExists");
  }
}

/**
 * Checks the request for required parameters
 * @param request
 */
export function validateRequest(request: APIRequest) {
  const { activityName, activityDescription, colorCode } = JSON.parse(request.body ?? "");

  if (!activityName || !activityDescription || !colorCode) {
    throw new BadRequestError("InvalidRequest");
  }

  if (colorCode.length !== 6 || !(colorCode as string).match("^[A-Fa-f0-9]{6}$")) {
    throw new BadRequestError("InvalidRequest");
  }

  return { activityName, activityDescription, colorCode };
}
