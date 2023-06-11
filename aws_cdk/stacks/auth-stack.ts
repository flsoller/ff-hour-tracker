import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { HttpLambdaAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';

export class AuthStack extends cdk.Stack {
  public readonly authorizer: HttpLambdaAuthorizer;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const authorizerService = new lambda.Function(this, 'AuthorizerService', {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      handler: 'index.handler',
      reservedConcurrentExecutions: 2,
      // TO-DO investigate s3 zip or docker based ECR source deployments
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('event: ', event)
        };
      `),
    });
    authorizerService.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    this.authorizer = new HttpLambdaAuthorizer(
      'HourTrackerAuthorizer',
      authorizerService
    );
  }
}
