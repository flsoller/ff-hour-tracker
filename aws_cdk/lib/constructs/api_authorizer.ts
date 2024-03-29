import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import {
  HttpLambdaAuthorizer,
  HttpLambdaResponseType,
} from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { DEFAULT_AUTHORIZER } from '../constants/constructs';
import { HOUR_TRACKER } from '../constants/stacks';

export class AuthorizerService extends Construct {
  public readonly authorizer: HttpLambdaAuthorizer;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER.API_AUTHORIZER
    );

    const authorizerService = new lambda.DockerImageFunction(
      this,
      DEFAULT_AUTHORIZER.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: 'latest',
        }),
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
