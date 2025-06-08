import { sql } from "drizzle-orm";
import { db } from "@hour-tracker/db";
import { logger } from "@hour-tracker/logger";

export default async () => {
  try {
    await db.execute(sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE datname = 'app_integration_tests'; 
      `);
  } catch {
    // Administrator closing the connection throws an error but this is the desired effect for teardown
    // and end the Jest run. Just logging here that the connection was closed.
    logger.info("Closed DB connection after integration test run");
  }
};
