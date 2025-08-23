import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { ENVIRONMENT_PARAMS } from "../constants/environments";
import { HOUR_TRACKER } from "../constants/stacks";
import { ActivityTypesService } from "./activity-types";
import { AuthenticationService } from "./authenticator";
import { AuthorizerService } from "./authorizer";
import { HourTrackerApiGateway } from "./gateway";
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
      ENVIRONMENT_PARAMS.DATABASE_URL_KEY,
    );

    const jwtSecretString = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.JWT_SECRET,
    );

    const newRelicAccountId = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.NEW_RELIC_ACCOUNT_ID,
    );

    const newRelicIngestLicense = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.NEW_RELIC_LICENSE_KEY,
    );

    const defaultAuthorizer = new AuthorizerService(
      this,
      HOUR_TRACKER.API_AUTHORIZER,
      {
        hashOrVersion,
        dbConnectionString,
        jwtSecretString,
        newRelicAccountId,
        newRelicIngestLicense,
      },
    );

    const apiGateway = new HourTrackerApiGateway(
      this,
      HOUR_TRACKER.API_GATEWAY,
      {
        authService: defaultAuthorizer.authorizer,
      },
    );

    new AuthenticationService(this, HOUR_TRACKER.API_AUTHENTICATOR, {
      apiGateway: apiGateway.httpApiGateway,
      dbConnectionString,
      hashOrVersion,
      jwtSecretString,
      newRelicAccountId,
      newRelicIngestLicense,
    });

    new MembersService(this, HOUR_TRACKER.API_MEMBERS, {
      apiGateway: apiGateway.httpApiGateway,
      dbConnectionString,
      hashOrVersion,
      newRelicAccountId,
      newRelicIngestLicense,
    });

    new ActivityTypesService(this, HOUR_TRACKER.API_ACTIVITY_TYPES, {
      apiGateway: apiGateway.httpApiGateway,
      dbConnectionString,
      hashOrVersion,
      newRelicAccountId,
      newRelicIngestLicense,
    });
  }
}
