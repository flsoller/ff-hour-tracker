import { sql } from "drizzle-orm";
import { db } from "@hour-tracker/db";
import postgres from "postgres";

describe("Migrations", () => {
  it("should apply all migrations to provided DB", async () => {
    const migrations = (await db.execute(
      sql`SELECT * FROM hour_tracker_migrations.migrations`
    )) as postgres.RowList<Record<string, unknown>[]>;
    expect(migrations).toHaveLength(1);
    migrations.map((migration) => {
      expect(migration).toMatchSnapshot({
        created_at: expect.any(String),
      });
    });
  });
});
