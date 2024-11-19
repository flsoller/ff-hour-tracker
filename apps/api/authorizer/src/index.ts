import {
  Context,
  APIGatewayProxyEventV2,
  APIGatewaySimpleAuthorizerWithContextResult,
} from "aws-lambda";
import { verifyAccessToken } from "./services/jwt";
import { getActiveUser } from "./services/user";
import { UserContext } from "./types/context.type";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<UserContext | null>> => {
  const token = event.headers.authorization;

  // Deny access when no token
  if (!token) {
    return {
      isAuthorized: false,
      context: null,
    };
  }

  const { userId, organizationId } = verifyAccessToken(token);

  // Deny access when no userId, organizationId can be obtained from token
  if (!userId || !organizationId) {
    return {
      isAuthorized: false,
      context: null,
    };
  }

  const { isActive, user } = await getActiveUser(userId, organizationId);
  const isAuthorized = isActive && !!user;
  return {
    isAuthorized,
    context: isAuthorized
      ? {
          userId,
          organizationId,
          role: user?.role ?? "",
        }
      : null,
  };
};