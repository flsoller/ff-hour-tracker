import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  HttpLambdaAuthorizer,
  HttpLambdaResponseType,
} from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { DEFAULT_AUTHORIZER } from '../constants/constructs';

export class AuthorizerService extends Construct {
  public readonly authorizer: HttpLambdaAuthorizer;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const authorizerService = new lambda.Function(
      this,
      DEFAULT_AUTHORIZER.NAME,
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: 128,
        handler: 'index.handler',
        reservedConcurrentExecutions: 5,
        // TO-DO investigate s3 zip or docker based ECR source deployments
        code: lambda.Code.fromInline(`
            exports.handler = async (event) => {
              console.log('event: ', event)
            };
          `),
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
