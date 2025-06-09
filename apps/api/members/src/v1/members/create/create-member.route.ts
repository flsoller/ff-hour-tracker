import { APIError } from "@hour-tracker/lambda-api/errors";
import { create } from "../../../common/repository/member";
import { APIRequest } from "../../../common/types/request.type";
import { isMemberEmailAddressUnique, validateRequest } from "./create-member.service";

/**
 * Create a new member
 * @param request - The API request
 * @returns The created member
 */
export async function createMember(request: APIRequest) {
  const organizationId = request.requestContext.authorizer.lambda.organizationId;
  const { firstName, lastName, emailAddress } = validateRequest(request);

  await isMemberEmailAddressUnique(
    organizationId,
    emailAddress,
  );

  const [member] = await create(organizationId, firstName, lastName, emailAddress);

  if (!member) {
    throw new APIError("FailedToCreateMember");
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      emailAddress: member.emailAddress,
    }),
  };
}
