import { db, DrizzleORM, models } from "@hour-tracker/db";

export async function getActiveUser(userId: string, organizationId: string) {
  const [user] = await db
    .select({
      id: models.users.id,
      organizationId: models.users.organizationId,
      role: models.users.role,
      active: models.users.active,
    })
    .from(models.users)
    .where(
      DrizzleORM.and(
        DrizzleORM.eq(models.users.id, userId),
        DrizzleORM.eq(models.users.organizationId, organizationId),
      ),
    )
    .limit(1);

  if (!user) {
    return {
      isActive: false,
      user: null,
    };
  }

  const { active, ...userProps } = user;
  return {
    isActive: active,
    user: {
      ...userProps,
    },
  };
}
