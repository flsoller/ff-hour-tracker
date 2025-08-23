import { db, DrizzleORM, models } from "@hour-tracker/db";
import { BadRequestError } from "@hour-tracker/lambda-api/errors";
import { APIRequest } from "../../../common/types/request.type";
import { isTypeOfNumbers, isValidOrderQuery } from "../../../common/utils/validators";

/**
 * Get paginated activity types for an organization
 * @param organizationId - The ID of the organization to get members for
 * @param limit - The number of members to return
 * @param offset - The number of members to skip
 * @param order - The order to sort the members by
 * @returns The activity types
 */
export async function getPaginatedActivityTypes(
  organizationId: string,
  limit: number,
  offset: number,
  order: "asc" | "desc",
) {
  const activityTypes = await db
    .select()
    .from(models.activityTypes)
    .where(
      DrizzleORM.eq(models.activityTypes.organizationId, organizationId),
    ).orderBy(DrizzleORM[order](models.activityTypes.activityName))
    .limit(limit)
    .offset(offset);

  return activityTypes;
}

/**
 * Validate the request parameters
 * @param request - The API request
 * @returns The validated request parameters
 */
export function validateRequest(request: APIRequest): {
  limit: number;
  offset: number;
  order: "asc" | "desc";
} {
  const limit = Number(request.queryStringParameters?.limit ?? 10);
  const offset = Number(request.queryStringParameters?.offset ?? 0);
  const order = request.queryStringParameters?.order === "desc" ? "desc" : "asc";

  if (!isTypeOfNumbers([limit, offset]) || !isValidOrderQuery(order)) {
    throw new BadRequestError("InvalidQueryParams");
  }

  return { limit, offset, order };
}
