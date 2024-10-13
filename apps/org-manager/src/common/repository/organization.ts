import { db, models, DrizzleORM } from "@hour-tracker/db";

/**
 * Gets an organization from the DB by name
 * @param name name of the organization to get
 * @returns
 */
export async function getOrganization(
  name: string
): Promise<{ id: string; name: string }[]> {
  const { organizations } = models;

  return db
    .select({ id: organizations.id, name: organizations.name })
    .from(organizations)
    .where(DrizzleORM.ilike(organizations.name, `%${name}%`))
    .limit(1);
}

/**
 * Inserts a new organization into the DB
 * @param orgData Details of the organization to create
 * @returns
 */
export async function createOrganization(orgData: {
  name: string;
  description?: string;
}): Promise<{ id: string; name: string }> {
  const { organizations } = models;

  const [organization] = await db
    .insert(organizations)
    .values({ name: orgData.name, description: orgData.description ?? "" })
    .returning();

  return { id: organization!.id, name: organization!.name };
}
