import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

interface UsersStackProps extends cdk.StackProps {
  apiGateway: HttpApi;
}

export class UsersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UsersStackProps) {
    super(scope, id, props);

    const usersService = new lambda.Function(this, 'UsersService', {
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
    usersService.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const usersServiceIntegration = new HttpLambdaIntegration(
      'UsersIntegration',
      usersService
    );

    props.apiGateway.addRoutes({
      integration: usersServiceIntegration,
      path: '/users',
      methods: [HttpMethod.ANY],
    });
    props.apiGateway.addRoutes({
      integration: usersServiceIntegration,
      path: '/users/{proxy+}',
      methods: [HttpMethod.ANY],
    });
  }
}
