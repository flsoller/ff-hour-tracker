import { createMember } from "./v1/members/create/create-member.route";
import { V1_POST_CREATE_MEMBER_KEY } from "./v1/members/create/create-member.type";
import { getMembersPaginated } from "./v1/members/paginated/get-members.route";
import { V1_GET_PAGINATED_ROUTE_KEY } from "./v1/members/paginated/get-members.type";

const ROUTE_KEYS = {
  V1_GET_PAGINATED_ROUTE_KEY,
  V1_POST_CREATE_MEMBER_KEY,
};

export const ROUTE_HANDLING_MAP = {
  [ROUTE_KEYS.V1_GET_PAGINATED_ROUTE_KEY]: getMembersPaginated,
  [ROUTE_KEYS.V1_POST_CREATE_MEMBER_KEY]: createMember,
};

export function getRouteHandler(httpMethod: string, routeKey: string) {
  const mapKey = `${httpMethod} ${routeKey.split(" ")[1]}`;
  return ROUTE_HANDLING_MAP[mapKey] ?? null;
}
