import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { DEFAULT_AUTHORIZER } from "../constants/constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { DEFAULT_INSTRUMENTATION_CONFIG } from "../constants/instrumentation";
import { LOGICAL_ID } from "../constants/logical-id";

interface AuthorizerProps {
  hashOrVersion: string;
  dbConnectionString: string;
  jwtSecretString: string;
  authorizedParty: string;
  newRelicAccountId: string;
  newRelicIngestLicense: string;
}

export class AuthorizerService extends Construct {
  public readonly authorizer: HttpLambdaAuthorizer;

  constructor(scope: Construct, id: string, props: AuthorizerProps) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER,
    );

    const authorizerService = new lambda.DockerImageFunction(
      this,
      DEFAULT_AUTHORIZER.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: props.hashOrVersion,
        }),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DATABASE_URL: props.dbConnectionString,
          JWT_SECRET: props.jwtSecretString,
          AUTHORIZED_PARTY: props.authorizedParty,
          NEW_RELIC_LAMBDA_HANDLER: "apps/api/authorizer/index.handler",
          NEW_RELIC_ACCOUNT_ID: props.newRelicAccountId,
          NEW_RELIC_LICENSE_KEY: props.newRelicIngestLicense,
          ...DEFAULT_INSTRUMENTATION_CONFIG,
        },
        memorySize: 1024,
        timeout: Duration.seconds(20),
        functionName: LOGICAL_ID.HOUR_TRACKER_API_AUTHORIZER,
      },
    );
    authorizerService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    this.authorizer = new HttpLambdaAuthorizer(
      DEFAULT_AUTHORIZER.LAMBDA_AUTHORIZER,
      authorizerService,
      {
        resultsCacheTtl: Duration.seconds(0),
        responseTypes: [HttpLambdaResponseType.SIMPLE],
      },
    );
  }
}
