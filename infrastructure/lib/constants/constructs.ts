export const API_GATEWAY = {
  NAME: "hour-tracker-api-gateway",
  LOG_GROUP_NAME: "hour-tracker-api-gateway-log-group",
};

export const DEFAULT_AUTHORIZER = {
  NAME: "hour-tracker-default-authorizer-service",
  LAMBDA_AUTHORIZER: "hour-tracker-default-lambda-authorizer",
};

export const AUTHENTICATOR_SERVICE = {
  NAME: "hour-tracker-authentication-service",
  LAMBDA_INTEGRATION: "hour-tracker-authentication-service-lambda-integration",
};

export const ORGANIZATION_MANAGER = {
  NAME: "hour-tracker-organization-manager",
};

export const MEMBERS_SERVICE = {
  NAME: "hour-tracker-members-service",
  LAMBDA_INTEGRATION: "hour-tracker-members-service-lambda-integration",
};

export const ACTIVITY_TYPES_SERVICE = {
  NAME: "hour-tracker-activity-types-service",
  LAMBDA_INTEGRATION: "hour-tracker-activity-types-service-lambda-integration",
};
