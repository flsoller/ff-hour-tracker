import { RemovalPolicy } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { USERS_SERVICE } from '../constants/constructs';

interface UsersProps {
  apiGateway: HttpApi;
}

export class UsersService extends Construct {
  constructor(scope: Construct, id: string, props: UsersProps) {
    super(scope, id);

    const usersService = new lambda.Function(this, USERS_SERVICE.NAME, {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      handler: 'index.handler',
      // TO-DO investigate s3 zip or docker based ECR source deployments
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('event: ', event)
        };
      `),
    });
    usersService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const usersServiceIntegration = new HttpLambdaIntegration(
      USERS_SERVICE.LAMBDA_INTEGRATION,
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
