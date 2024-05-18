import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { CONNECTION_STRING } from './config';
import postgres from 'postgres';

const migrationClient = postgres(CONNECTION_STRING, { max: 1 });

async function migrateDb() {
  console.log('Initiating Migration');
  await migrate(drizzle(migrationClient), {
    migrationsFolder: __dirname + '/migrations',
    migrationsTable: 'migrations',
    migrationsSchema: 'hour_tracker_migrations',
  });
}

migrateDb()
  .then(() => {
    console.log('Database Migration Completed');
    process.exit();
  })
  .catch((e) => {
    console.error('Error during migration', e);
    process.exit(1);
  });
