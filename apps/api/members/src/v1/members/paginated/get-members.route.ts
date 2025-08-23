import { countAll } from "../../../common/repository/member";
import { APIRequest } from "../../../common/types/request.type";
import { getPaginatedMembers, validateRequest } from "./get-members.service";

/**
 * Get paginated members for an organization
 * @param request - The API request
 * @returns The paginated members
 */
export async function getMembersPaginated(request: APIRequest) {
  const { limit, offset, order } = validateRequest(request);
  const organizationId = request.requestContext.authorizer.lambda.organizationId;

  const members = await getPaginatedMembers(
    organizationId,
    limit,
    offset,
    order,
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ data: members, totalCount: await countAll(organizationId) }),
  };
}
