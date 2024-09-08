import { SIGNIN_ROUTE_KEY } from "../common/types/signin.types";
import { handleSignIn } from "../handlers/signin";

const ROUTE_KEYS = {
  SIGNIN: SIGNIN_ROUTE_KEY,
};

export const ROUTE_HANDLING_MAP = {
  [ROUTE_KEYS.SIGNIN]: handleSignIn,
};

export function getRouteHandler(routeKey: string) {
  return ROUTE_HANDLING_MAP[routeKey] ?? null;
}
