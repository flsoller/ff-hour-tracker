import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda";
import { HourTrackerRequestContext } from "./auth-context.type";

export type APIRequest =
  APIGatewayProxyEventV2WithRequestContext<HourTrackerRequestContext>;
