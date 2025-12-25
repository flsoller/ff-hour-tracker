import { createActivityType } from "./v1/activity-types/create/create-activity.route";
import { V1_POST_CREATE_ACTIVITY_KEY } from "./v1/activity-types/create/create-activity.type";
import { updateActivityType } from "./v1/activity-types/id/put/put-activity.route";
import { V1_PUT_ACTIVITY_KEY } from "./v1/activity-types/id/put/put-activity.type";
import { getActivityTypesPaginated } from "./v1/activity-types/paginated/get-activities.route";
import { V1_GET_ACTIVITIES_KEY } from "./v1/activity-types/paginated/get-activities.type";
const ROUTE_KEYS = {
  V1_POST_CREATE_ACTIVITY_KEY,
  V1_GET_ACTIVITIES_KEY,
  V1_PUT_ACTIVITY_KEY,
};

export const ROUTE_HANDLING_MAP = {
  [ROUTE_KEYS.V1_GET_ACTIVITIES_KEY]: getActivityTypesPaginated,
  [ROUTE_KEYS.V1_POST_CREATE_ACTIVITY_KEY]: createActivityType,
  [ROUTE_KEYS.V1_PUT_ACTIVITY_KEY]: updateActivityType,
};

export function getRouteHandler(httpMethod: string, routeKey: string) {
  const mapKey = `${httpMethod} ${routeKey.split(" ")[1]}`;
  return ROUTE_HANDLING_MAP[mapKey] ?? null;
}
