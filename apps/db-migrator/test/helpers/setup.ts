import { sql } from "drizzle-orm";
import { db, models } from "@hour-tracker/db";
jest.setTimeout(10000);

beforeEach(async () => {
  await db.execute(sql`TRUNCATE ${models.organizations} CASCADE`);
  await db.execute(sql`TRUNCATE ${models.members} CASCADE`);
  await db.execute(sql`TRUNCATE ${models.timeLogs} CASCADE`);
  await db.execute(sql`TRUNCATE ${models.activityTypes} CASCADE`);
  await db.execute(sql`TRUNCATE ${models.users} CASCADE`);
});
