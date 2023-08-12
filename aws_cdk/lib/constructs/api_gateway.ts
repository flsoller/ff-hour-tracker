import { Construct } from 'constructs';
import { CorsHttpMethod, HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';
import { API_GATEWAY } from '../constants/constructs';

interface ApiGatewayProps {
  authService: HttpLambdaAuthorizer;
}

export class HourTrackerApiGateway extends Construct {
  public readonly httpApiGateway: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const gateway = new HttpApi(this, API_GATEWAY.NAME, {
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
    gateway.applyRemovalPolicy(RemovalPolicy.DESTROY);
    gateway.addStage('custom', {
      throttle: {
        rateLimit: 10,
        burstLimit: 5,
      },
      autoDeploy: true,
    });

    this.httpApiGateway = gateway;
  }
}
