const util = require("util");
const exec = util.promisify(require("child_process").exec);

/**
 * Run migrations to initialize db
 */
export default async () => {
  await exec(
    `yarn workspace @hour-tracker/db-migrator db:migration:test:migrate`
  );
};
