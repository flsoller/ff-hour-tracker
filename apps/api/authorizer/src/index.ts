import { logger } from "@hour-tracker/logger";
import { APIGatewayProxyEventV2, APIGatewaySimpleAuthorizerWithContextResult } from "aws-lambda";
import { verifyAccessToken } from "./services/jwt";
import { syncUserAndOrg } from "./services/sync";
import { UserContext } from "./types/context.type";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<
  APIGatewaySimpleAuthorizerWithContextResult<UserContext | object>
> => {
  const token = event.headers.authorization?.split("Bearer ")[1];

  // Deny access when no token
  if (!token) {
    logger.warn("No token provided");
    return {
      isAuthorized: false,
      context: {},
    };
  }

  const payload = await verifyAccessToken(token);

  // Deny access when no userId, organizationId can be obtained from token
  if (!payload || !payload.clerkOrgId) {
    logger.warn("Invalid token provided");
    return {
      isAuthorized: false,
      context: {},
    };
  }

  const { organization, user } = await syncUserAndOrg(payload);
  if (!organization || !user) {
    return {
      isAuthorized: false,
      context: {},
    };
  }
  const isAuthorized = user.active && !!user;

  return {
    isAuthorized,
    context: isAuthorized
      ? {
        userId: user.id,
        organizationId: organization.id,
        role: user.role,
      }
      : {},
  };
};
