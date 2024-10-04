import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { ORGANIZATION_MANAGER } from "../constants/constructs";
import { ENVIRONMENT_PARAMS } from "../constants/environments";

export class HourTrackerOrganizationManager extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const dbConnectionString = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.DATABASE_URL_KEY
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
        },
      }
    );
    organizationManager.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}
