import { getMembersPaginated } from "./v1/paginated/get-members.route";
import { V1_GET_PAGINATED_ROUTE_KEY } from "./v1/paginated/get-members.type";

const ROUTE_KEYS = {
  V1_GET_PAGINATED_ROUTE_KEY,
};

export const ROUTE_HANDLING_MAP = {
  [ROUTE_KEYS.V1_GET_PAGINATED_ROUTE_KEY]: getMembersPaginated,
};

export function getRouteHandler(routeKey: string) {
  return ROUTE_HANDLING_MAP[routeKey] ?? null;
}
