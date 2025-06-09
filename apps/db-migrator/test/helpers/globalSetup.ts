import { exec } from "child_process";
import util from "util";

/**
 * Run migrations to initialize db
 */
export default async () => {
  await util.promisify(exec)(
    `yarn workspace @hour-tracker/db-migrator db:migration:test:migrate`,
  );
};
