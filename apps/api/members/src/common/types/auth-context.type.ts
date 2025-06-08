import { APIGatewayEventRequestContextV2 } from "aws-lambda";

export interface HourTrackerRequestContext
  extends APIGatewayEventRequestContextV2 {
  authorizer: {
    lambda: {
      userId: string;
      organizationId: string;
      role: string;
    };
  };
}
