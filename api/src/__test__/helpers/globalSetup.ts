/* eslint-disable @typescript-eslint/no-var-requires */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * For now just force reset the db before the tests,
 * will run the migrations in the future
 */
module.exports = async () => {
  await exec(`yarn prisma db push --force-reset`);
};
