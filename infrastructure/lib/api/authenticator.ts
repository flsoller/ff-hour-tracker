import {
  HttpApi,
  HttpMethod,
  HttpNoneAuthorizer,
} from "aws-cdk-lib/aws-apigatewayv2";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import { AUTHENTICATOR_SERVICE } from "../constants/constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { LOGICAL_ID } from "../constants/logical-id";

interface AuthenticatorProps {
  hashOrVersion: string;
  dbConnectionString: string;
  apiGateway: HttpApi;
  jwtSecretString: string;
  newRelicAccountId: string;
  newRelicIngestLicense: string;
}

export class AuthenticationService extends Construct {
  constructor(scope: Construct, id: string, props: AuthenticatorProps) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHENTICATOR
    );

    const authenticatorService = new lambda.DockerImageFunction(
      this,
      AUTHENTICATOR_SERVICE.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: props.hashOrVersion,
        }),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DATABASE_URL: props.dbConnectionString,
          JWT_SECRET: props.jwtSecretString,
          NEW_RELIC_LAMBDA_HANDLER: "apps/api/authenticator/index.handler",
          NEW_RELIC_ACCOUNT_ID: props.newRelicAccountId,
          NEW_RELIC_LICENSE_KEY: props.newRelicIngestLicense,
        },
        memorySize: 256,
        timeout: Duration.seconds(20),
        functionName: LOGICAL_ID.HOUR_TRACKER_API_AUTHENTICATOR,
      }
    );
    authenticatorService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const authenticatorServiceIntegration = new HttpLambdaIntegration(
      AUTHENTICATOR_SERVICE.LAMBDA_INTEGRATION,
      authenticatorService
    );

    props.apiGateway.addRoutes({
      integration: authenticatorServiceIntegration,
      path: "/auth/signin",
      methods: [HttpMethod.POST],
      authorizer: new HttpNoneAuthorizer(),
    });
  }
}
