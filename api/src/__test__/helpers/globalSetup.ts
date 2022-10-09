/* eslint-disable @typescript-eslint/no-var-requires */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Run migrations to initialize db
 */
module.exports = async () => {
  await exec(`yarn prisma migrate reset --force`);
};

export {};
