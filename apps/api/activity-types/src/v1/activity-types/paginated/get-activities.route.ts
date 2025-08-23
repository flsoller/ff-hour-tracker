import { countAll } from "../../../common/repository/activity-type";
import { APIRequest } from "../../../common/types/request.type";
import { getPaginatedActivityTypes, validateRequest } from "./get-activities.service";

/**
 * Returns paginated activity types for an organization
 * @param request - The API request
 * @returns
 */
export async function getActivityTypesPaginated(request: APIRequest) {
  const { limit, offset, order } = validateRequest(request);
  const organizationId = request.requestContext.authorizer.lambda.organizationId;

  const activityTypes = await getPaginatedActivityTypes(
    organizationId,
    limit,
    offset,
    order,
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: activityTypes,
      totalCount: await countAll(organizationId),
    }),
  };
}
