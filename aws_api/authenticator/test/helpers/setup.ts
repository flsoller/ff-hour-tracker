import { DrizzleORM } from '@hour-tracker/core-db';
import { db, models } from '@hour-tracker/core-db';
jest.setTimeout(10000);

beforeEach(async () => {
  await db.execute(DrizzleORM.sql`TRUNCATE ${models.organizations} CASCADE`);
  await db.execute(DrizzleORM.sql`TRUNCATE ${models.members} CASCADE`);
  await db.execute(DrizzleORM.sql`TRUNCATE ${models.timeLogs} CASCADE`);
  await db.execute(DrizzleORM.sql`TRUNCATE ${models.activityTypes} CASCADE`);
  await db.execute(DrizzleORM.sql`TRUNCATE ${models.users} CASCADE`);
});
