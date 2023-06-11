import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CorsHttpMethod, HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';

interface ApiGatewayProps extends cdk.StackProps {
  authService: HttpLambdaAuthorizer;
}

export class ApiGwV2Stack extends cdk.Stack {
  public readonly httpApiGateway: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id, props);

    this.httpApiGateway = new HttpApi(this, 'HourTrackerApi', {
      description: 'REST API for hour tracker app',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
      createDefaultStage: false,
      defaultAuthorizer: props.authService,
    });

    this.httpApiGateway.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    this.httpApiGateway.addStage('dev', {
      throttle: {
        rateLimit: 50,
        burstLimit: 75,
      },
    });
  }
}
