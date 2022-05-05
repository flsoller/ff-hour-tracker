/* eslint-disable @typescript-eslint/no-var-requires */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

jest.setTimeout(10000);

/**
 * For now just force reset the db before the tests,
 * will run the migrations in the future
 */
beforeAll(async () => {
  await exec(`yarn prisma db push --force-reset`);
});
