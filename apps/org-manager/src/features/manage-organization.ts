import { createOrganization, getOrganization } from "../common/repository/organization";
import { createUser, deleteUser, getUser } from "../common/repository/user";
import { hashPassword } from "../common/services/bcrypt";
import { ManageOrganizationPayload } from "../common/types/actions.type";

/**
 * Creates or removes support user
 * @param enableSupportAdmin
 * @param organizationId
 * @returns
 */
async function createOrRemoveSupportUser(
  enableSupportAdmin: boolean,
  organizationId: string,
): Promise<void> {
  const [existingSupportUser] = await getUser(
    process.env.SUPPORT_USER_EMAIL!,
    organizationId,
  );

  // If enableSupportAdmin is true and no support user exists, create it.
  if (enableSupportAdmin && !existingSupportUser) {
    const hashedPassword = await hashPassword(process.env.SUPPORT_USER_PW!);
    return createUser({
      emailAddress: process.env.SUPPORT_USER_EMAIL!,
      name: "Support User",
      password: hashedPassword,
      organizationId,
    });
  }

  // By default remove the supportUser by default if not specified otherwise
  if (!enableSupportAdmin && existingSupportUser) {
    return deleteUser(existingSupportUser.id, organizationId);
  }

  return;
}

/**
 * Gets or creates an organization
 * @param name
 * @param description
 * @returns
 */
async function getOrCreateOrganization(name: string, description?: string) {
  const [existingOrganization] = await getOrganization(name);

  return existingOrganization
    ? existingOrganization
    : await createOrganization({
      name,
      description,
    });
}

/**
 * Manages the creation of a new organization and it's users
 * @param payload
 * @returns
 */
export async function manageOrganization(
  payload: ManageOrganizationPayload,
): Promise<void> {
  const organization = await getOrCreateOrganization(
    payload.organization.name,
    payload.organization.description,
  );

  await createOrRemoveSupportUser(payload.enableSupportAdmin, organization.id);

  // Create all users specified in the payload
  for (const user of payload.users) {
    await createUser({
      emailAddress: user.emailAddress,
      name: user.name,
      // temporary default password until users can manage their credentials via PW reset
      password: await hashPassword(process.env.SUPPORT_USER_PW!),
      organizationId: organization.id,
    });
  }
}
