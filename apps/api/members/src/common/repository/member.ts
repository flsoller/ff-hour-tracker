import { db, DrizzleORM, models } from "@hour-tracker/db";

/**
 * Get a member by their email address
 * @param organizationId - The ID of the organization
 * @param emailAddress - The email address to search for
 * @returns The member if found, null otherwise
 */
export async function getByEmailAddress(
  organizationId: string,
  emailAddress: string,
) {
  const [member] = await db
    .select()
    .from(models.members)
    .where(
      DrizzleORM.and(
        DrizzleORM.eq(models.members.emailAddress, emailAddress),
        DrizzleORM.eq(models.members.organizationId, organizationId),
      ),
    )
    .limit(1);

  return member ?? null;
}

/**
 * Create a new member
 * @param organizationId - The ID of the organization
 * @param firstName - The first name of the member
 * @param lastName - The last name of the member
 * @param emailAddress - The email address of the member
 */
export async function create(
  organizationId: string,
  firstName: string,
  lastName: string,
  emailAddress: string,
) {
  return await db.insert(models.members).values({
    organizationId,
    firstName,
    lastName,
    emailAddress,
  }).returning();
}
