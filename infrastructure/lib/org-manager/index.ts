import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { ORGANIZATION_MANAGER } from "../constants/constructs";
import { ENVIRONMENT_PARAMS } from "../constants/environments";
import { LOGICAL_ID } from "../constants/logical-id";

export class HourTrackerOrganizationManager extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const dbConnectionString = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.DATABASE_URL_KEY
    );
    const supportUserEmail = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.SUPPORT_USER_EMAIL
    );
    const supportUserPassword = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.SUPPORT_USER_PW
    );

    const newRelicAccountId = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.NEW_RELIC_ACCOUNT_ID
    );

    const newRelicIngestLicense = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.NEW_RELIC_LICENSE_KEY
    );

    const hashOrVersion = new cdk.CfnParameter(this, "hashOrVersion", {
      description: "The version or hash used to reference the images",
      type: "String",
    }).valueAsString;

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.ORGANIZATION_MANAGER
    );

    const organizationManager = new lambda.DockerImageFunction(
      this,
      ORGANIZATION_MANAGER.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: hashOrVersion,
        }),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DATABASE_URL: dbConnectionString,
          SUPPORT_USER_EMAIL: supportUserEmail,
          SUPPORT_USER_PW: supportUserPassword,
          NEW_RELIC_LAMBDA_HANDLER: "apps/org-manager/index.handler",
          NEW_RELIC_ACCOUNT_ID: newRelicAccountId,
          NEW_RELIC_LICENSE_KEY: newRelicIngestLicense,
        },
        timeout: Duration.seconds(20),
        functionName: LOGICAL_ID.HOUR_TRACKER_API_ORG_MANAGER,
      }
    );
    organizationManager.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}
