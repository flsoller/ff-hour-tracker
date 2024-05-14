import { localDb } from './clients/pg';
import { serverlessDb } from './clients/serverless-pg';
import { USE_LOCAL_CLIENT } from './config';

// Model imports for exposing them with the db package
import { activityTypes } from './schema/activity-type';
import { members } from './schema/member';
import { organizations } from './schema/organization';
import { timeLogs } from './schema/time-log';
import { users } from './schema/user';

/**
 * Gets the necessary database client depending on where this package is used.
 * Neon serverless driver communicates over http which can not be used for local
 * and integration test setups.
 */
function getDbClient() {
  return USE_LOCAL_CLIENT ? localDb : serverlessDb;
}

export const db = getDbClient();
export const models = {
  activityTypes,
  members,
  organizations,
  timeLogs,
  users,
};
