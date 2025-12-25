import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { ACTIVITY_TYPES_SERVICE } from "../constants/constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { DEFAULT_INSTRUMENTATION_CONFIG } from "../constants/instrumentation";
import { LOGICAL_ID } from "../constants/logical-id";

interface ActivityTypesProps {
  hashOrVersion: string;
  dbConnectionString: string;
  apiGateway: HttpApi;
  newRelicAccountId: string;
  newRelicIngestLicense: string;
}

export class ActivityTypesService extends Construct {
  constructor(scope: Construct, id: string, props: ActivityTypesProps) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.API_ACTIVITY_TYPES,
    );

    const activityTypesService = new lambda.DockerImageFunction(
      this,
      ACTIVITY_TYPES_SERVICE.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: props.hashOrVersion,
        }),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DATABASE_URL: props.dbConnectionString,
          NEW_RELIC_LAMBDA_HANDLER: "apps/api/activity-types/index.handler",
          NEW_RELIC_ACCOUNT_ID: props.newRelicAccountId,
          NEW_RELIC_LICENSE_KEY: props.newRelicIngestLicense,
          ...DEFAULT_INSTRUMENTATION_CONFIG,
        },
        memorySize: 1024,
        timeout: Duration.seconds(20),
        functionName: LOGICAL_ID.HOUR_TRACKER_API_ACTIVITY_TYPES,
      },
    );
    activityTypesService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const activityTypesServiceIntegration = new HttpLambdaIntegration(
      ACTIVITY_TYPES_SERVICE.LAMBDA_INTEGRATION,
      activityTypesService,
    );

    props.apiGateway.addRoutes({
      integration: activityTypesServiceIntegration,
      path: "/v1/activity-types",
      methods: [HttpMethod.GET, HttpMethod.POST],
    });
  }
}
