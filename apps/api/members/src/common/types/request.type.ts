import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from "aws-lambda";
import { HourTrackerRequestContext } from "./auth-context.type";

export interface APIRequest
  extends APIGatewayProxyEventV2WithRequestContext<HourTrackerRequestContext> {}
