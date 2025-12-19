import { db, DrizzleORM, models } from "@hour-tracker/db";
import type { TokenPayload } from "../types/context.type";

export async function syncUserAndOrg(payload: TokenPayload) {
  const { existingOrg, existingUser } = await getOrgAndUser(payload.clerkOrgId, payload.clerkUserId);

  const organization = existingOrg ?? await createOrg(payload);
  const user = existingUser ?? await createUser(payload, organization!.id);

  return {
    organization,
    user,
  };
}

/**
 * Fetches the org and user from the DB based on the verified token
 * @param clerkOrgId
 * @param clerkUserId
 * @returns
 */
async function getOrgAndUser(clerkOrgId: string, clerkUserId: string) {
  const [existingOrg] = await db
    .select()
    .from(models.organizations)
    .where(
      DrizzleORM.eq(models.organizations.authProviderId, clerkOrgId),
    )
    .limit(1);
  const [existingUser] = await db
    .select()
    .from(models.users)
    .where(
      DrizzleORM.eq(models.users.authProviderId, clerkUserId),
    )
    .limit(1);

  return {
    existingOrg,
    existingUser,
  };
}

/**
 * Creates an organization and returns it
 * @param payload
 */
async function createOrg(payload: TokenPayload) {
  const [org] = await db.insert(models.organizations).values({
    name: payload.orgName,
    authProviderId: payload.clerkOrgId,
  }).returning();

  return org;
}

/**
 * Creates a user under an existing organization
 * @param payload
 * @param organizationId
 * @returns
 */
async function createUser(payload: TokenPayload, organizationId: string) {
  const [user] = await db.insert(models.users).values({
    emailAddress: payload.userEmail,
    name: payload.userName,
    organizationId,
    authProviderId: payload.clerkUserId,
  }).returning();

  return user;
}
