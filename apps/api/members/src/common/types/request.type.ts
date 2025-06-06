import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from "aws-lambda";
import { HourTrackerAuthorizerContext } from "./auth-context.type";

export interface APIRequest
  extends APIGatewayProxyEventV2WithRequestContext<HourTrackerAuthorizerContext> {}
