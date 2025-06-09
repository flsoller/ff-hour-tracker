import { BadRequestError } from "@hour-tracker/lambda-api/errors";
import { getByEmailAddress } from "../../../common/repository/member";
import { APIRequest } from "../../../common/types/request.type";
import { validateEmailRegex } from "../../../common/utils/validators";

/**
 * Check if a member's email address is unique
 * @param organizationId - The ID of the organization
 * @param emailAddress - The email address to check
 * @returns True if the email address is unique, false otherwise
 */
export async function isMemberEmailAddressUnique(
  organizationId: string,
  emailAddress: string,
): Promise<void> {
  const member = await getByEmailAddress(organizationId, emailAddress);
  if (member) {
    throw new BadRequestError("MemberAlreadyExists");
  }
}

/**
 * Validate the request body
 * @param request - The API request
 * @returns The validated request body
 */
export function validateRequest(request: APIRequest) {
  const { firstName, lastName, emailAddress } = JSON.parse(request.body ?? "");

  if (!firstName || !lastName || !emailAddress || !validateEmailRegex(emailAddress)) {
    throw new BadRequestError("InvalidRequest");
  }

  return { firstName, lastName, emailAddress };
}
