import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ecr from "aws-cdk-lib/aws-ecr";
import {
  HttpLambdaAuthorizer,
  HttpLambdaResponseType,
} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { DEFAULT_AUTHORIZER } from "../constants/constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";

interface AuthorizerProps {
  hashOrVersion: string;
  dbConnectionString: string;
  jwtSecretString: string;
}

export class AuthorizerService extends Construct {
  public readonly authorizer: HttpLambdaAuthorizer;

  constructor(scope: Construct, id: string, props: AuthorizerProps) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER
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
        },
      }
    );
    authorizerService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    this.authorizer = new HttpLambdaAuthorizer(
      DEFAULT_AUTHORIZER.LAMBDA_AUTHORIZER,
      authorizerService,
      {
        resultsCacheTtl: Duration.seconds(0),
        responseTypes: [HttpLambdaResponseType.SIMPLE],
      }
    );
  }
}
