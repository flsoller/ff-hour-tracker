import { db, DrizzleORM, models } from "@hour-tracker/db";
import { users } from "@hour-tracker/db/schemas/user";

/**
 * Gets a user from the DB by email
 * @param emailAddress
 * @param organizationId
 * @returns
 */
export async function getUser(
  emailAddress: string,
  organizationId: string,
): Promise<{ id: string; emailAddress: string }[]> {
  const { users } = models;

  return db
    .select({ id: users.id, emailAddress: users.emailAddress })
    .from(users)
    .where(
      DrizzleORM.and(
        DrizzleORM.ilike(users.emailAddress, `%${emailAddress}%`),
        DrizzleORM.eq(users.organizationId, organizationId),
      ),
    )
    .limit(1);
}

/**
 * Inserts a new user into the DB
 * @param userData details of the user to create
 * @returns
 */
export async function createUser(userData: {
  emailAddress: string;
  name: string;
  password: string;
  organizationId: string;
}): Promise<void> {
  const { users } = models;
  const { emailAddress, name, password, organizationId } = userData;

  await db
    .insert(users)
    .values({
      emailAddress: emailAddress.toLowerCase(),
      name,
      password,
      role: "ADMIN",
      organizationId,
    })
    .onConflictDoNothing();
}

/**
 * Removes a user from the DB
 * @param userId
 * @param organizationId
 */
export async function deleteUser(userId: string, organizationId: string) {
  await db
    .delete(users)
    .where(
      DrizzleORM.and(
        DrizzleORM.eq(users.id, userId),
        DrizzleORM.eq(users.organizationId, organizationId),
      ),
    );
}
