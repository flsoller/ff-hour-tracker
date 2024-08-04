import { DrizzleORM } from '@hour-tracker/core-db';
import { db } from '@hour-tracker/core-db';

export default async () => {
  try {
    await db.execute(DrizzleORM.sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE datname = 'app_integration_tests'; 
      `);
  } catch (error) {
    // Administrator closing the connection throws an error but this is the desired effect for teardown
    // and end the Jest run. Just logging here that the connection was closed.
    console.log('Closed DB connection after integration test run');
  }
};
