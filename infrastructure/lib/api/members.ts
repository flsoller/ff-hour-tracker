import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { MEMBERS_SERVICE } from "../constants/constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { DEFAULT_INSTRUMENTATION_CONFIG } from "../constants/instrumentation";
import { LOGICAL_ID } from "../constants/logical-id";

interface MembersProps {
  hashOrVersion: string;
  dbConnectionString: string;
  apiGateway: HttpApi;
  newRelicAccountId: string;
  newRelicIngestLicense: string;
}

export class MembersService extends Construct {
  constructor(scope: Construct, id: string, props: MembersProps) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.API_MEMBERS,
    );

    const membersService = new lambda.DockerImageFunction(
      this,
      MEMBERS_SERVICE.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: props.hashOrVersion,
        }),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DATABASE_URL: props.dbConnectionString,
          NEW_RELIC_LAMBDA_HANDLER: "apps/api/members/index.handler",
          NEW_RELIC_ACCOUNT_ID: props.newRelicAccountId,
          NEW_RELIC_LICENSE_KEY: props.newRelicIngestLicense,
          ...DEFAULT_INSTRUMENTATION_CONFIG,
        },
        memorySize: 256,
        timeout: Duration.seconds(20),
        functionName: LOGICAL_ID.HOUR_TRACKER_API_MEMBERS,
      },
    );
    membersService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const membersServiceIntegration = new HttpLambdaIntegration(
      MEMBERS_SERVICE.LAMBDA_INTEGRATION,
      membersService,
    );

    props.apiGateway.addRoutes({
      integration: membersServiceIntegration,
      path: "/v1/members",
      methods: [HttpMethod.GET, HttpMethod.POST],
    });
  }
}
