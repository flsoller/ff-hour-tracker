import { db, DrizzleORM, models } from "@hour-tracker/db";

/**
 * Create a new activity type
 * @param organizationId
 * @param activityName
 * @param activityDescription
 * @param colorCode
 * @returns
 */
export async function create(
  organizationId: string,
  activityName: string,
  activityDescription: string,
  colorCode: string,
) {
  return db.insert(models.activityTypes).values({
    organizationId,
    activityName,
    activityDescription,
    colorCode,
  }).returning();
}

/**
 * Finds an activity type by name
 * @param organizationId
 * @param name
 */
export async function getByName(organizationId: string, name: string) {
  const [activityType] = await db.select().from(models.activityTypes).where(
    DrizzleORM.and(
      DrizzleORM.eq(models.activityTypes.organizationId, organizationId),
      DrizzleORM.eq(models.activityTypes.activityName, name),
    ),
  ).limit(1);

  return activityType ?? null;
}

/**
 * Counts all activity types for an organization
 * @param organizationId
 * @returns
 */
export async function countAll(organizationId: string): Promise<number> {
  return (
    await db.select()
      .from(models.activityTypes)
      .where(DrizzleORM.eq(models.activityTypes.organizationId, organizationId))
  )
    .length;
}
