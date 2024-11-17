import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthorizerService } from "./authorizer";
import { HourTrackerApiGateway } from "./gateway";
import { HOUR_TRACKER } from "../constants/stacks";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { ENVIRONMENT_PARAMS } from "../constants/environments";
import { AuthenticationService } from "./authenticator";
import { MembersService } from "./members";

export class HourTrackerApi extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hashOrVersion = new cdk.CfnParameter(this, "hashOrVersion", {
      description: "The version or hash used to reference the images",
      type: "String",
    }).valueAsString;

    const dbConnectionString = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.DATABASE_URL_KEY
    );

    const jwtSecretString = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.JWT_SECRET
    );

    const defaultAuthorizer = new AuthorizerService(
      this,
      HOUR_TRACKER.API_AUTHORIZER,
      {
        hashOrVersion,
        dbConnectionString,
        jwtSecretString,
      }
    );

    const apiGateway = new HourTrackerApiGateway(
      this,
      HOUR_TRACKER.API_GATEWAY,
      {
        authService: defaultAuthorizer.authorizer,
      }
    );

    new AuthenticationService(this, HOUR_TRACKER.API_AUTHENTICATOR, {
      apiGateway: apiGateway.httpApiGateway,
      dbConnectionString,
      hashOrVersion,
      jwtSecretString,
    });

    new MembersService(this, HOUR_TRACKER.API_MEMBERS, {
      apiGateway: apiGateway.httpApiGateway,
      dbConnectionString,
      hashOrVersion,
    });
  }
}
