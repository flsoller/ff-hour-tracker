import { getMembersPaginated } from "./v1/paginated/get-members.route";
import { V1_GET_PAGINATED_ROUTE_KEY } from "./v1/paginated/get-members.type";

const ROUTE_KEYS = {
  V1_GET_PAGINATED_ROUTE_KEY,
};

export const ROUTE_HANDLING_MAP = {
  [ROUTE_KEYS.V1_GET_PAGINATED_ROUTE_KEY]: getMembersPaginated,
};

export function getRouteHandler(httpMethod: string, routeKey: string) {
  const mapKey = `${httpMethod} ${routeKey.split(" ")[1]}`;
  return ROUTE_HANDLING_MAP[mapKey] ?? null;
}
