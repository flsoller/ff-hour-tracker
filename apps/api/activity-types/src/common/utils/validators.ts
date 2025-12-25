import { BadRequestError } from "@hour-tracker/lambda-api/errors";
import { getByName } from "../repository/activity-type";
import { APIRequest } from "../types/request.type";

/**
 * Check if the checkTypes are of type number
 * @param checkTypes - The types to check
 * @returns True if the checkTypes are of type number, false otherwise
 */
export function isTypeOfNumbers(checkTypes: unknown[] = []) {
  return checkTypes.every((item) => Number.isInteger(item));
}

/**
 * Check if the order query is valid
 * @param query - The order query
 * @returns True if the order query is valid, false otherwise
 */
export function isValidOrderQuery(query = "") {
  return ["asc", "desc"].includes(query);
}

/**
 * Checks the request for required parameters
 * @param request
 * @param currentActivityId - Optional ID of the activity being updated (to exclude from duplicate check)
 */
export async function validateRequest(request: APIRequest, currentActivityId?: string) {
  const organizationId = request.requestContext.authorizer.lambda.organizationId;
  const { activityName, activityDescription, colorCode } = JSON.parse(request.body ?? "");

  if (!activityName || !activityDescription || !colorCode) {
    throw new BadRequestError("InvalidRequest");
  }

  if (colorCode.length !== 6 || !(colorCode as string).match("^[A-Fa-f0-9]{6}$")) {
    throw new BadRequestError("InvalidRequest");
  }

  const existingActivity = await getByName(organizationId, activityName);
  if (existingActivity && existingActivity.id !== currentActivityId) {
    throw new BadRequestError("ActivityAlreadyExists");
  }

  return { activityName, activityDescription, colorCode };
}
