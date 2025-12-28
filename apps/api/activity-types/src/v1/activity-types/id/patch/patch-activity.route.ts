import { updateActiveStatusById } from "../../../../common/repository/activity-type";
import { APIRequest } from "../../../../common/types/request.type";
import { validateDeactivationRequest } from "./patch-activity.service";

/**
 * Patches the active status for an activity type
 * @param request
 * @returns
 */
export async function patchActiveStatus(request: APIRequest) {
  const organizationId = request.requestContext.authorizer.lambda.organizationId;
  const { id, active } = await validateDeactivationRequest(organizationId, request);

  await updateActiveStatusById(id, active);

  return {
    statusCode: 204,
  };
}
