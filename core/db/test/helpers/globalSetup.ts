const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Run migrations to initialize db
 */
export default async () => {
  await exec(`yarn db:migration:test:migrate`);
};
