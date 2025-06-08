import {
  Context,
  APIGatewayProxyEventV2,
  APIGatewaySimpleAuthorizerWithContextResult,
} from "aws-lambda";
import { verifyAccessToken } from "./services/jwt";
import { getActiveUser } from "./services/user";
import { UserContext } from "./types/context.type";
import { logger } from "@hour-tracker/logger";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<UserContext | {}>> => {
  const token = event.headers.authorization?.split("Bearer ")[1];

  // Deny access when no token
  if (!token) {
    logger.warn("No token provided");
    return {
      isAuthorized: false,
      context: {},
    };
  }

  const { userId, organizationId } = verifyAccessToken(token);

  // Deny access when no userId, organizationId can be obtained from token
  if (!userId || !organizationId) {
    logger.warn("Invalid token provided");
    return {
      isAuthorized: false,
      context: {},
    };
  }

  const { isActive, user } = await getActiveUser(userId, organizationId);
  const isAuthorized = isActive && !!user;

  logger.info({ isActive, user }, "User request evaluated");

  return {
    isAuthorized,
    context: isAuthorized
      ? {
          userId,
          organizationId,
          role: user?.role ?? "",
        }
      : {},
  };
};
