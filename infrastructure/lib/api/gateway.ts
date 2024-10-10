import { Construct } from "constructs";
import {
  CorsHttpMethod,
  HttpApi,
  DomainName,
} from "aws-cdk-lib/aws-apigatewayv2";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { HttpLambdaAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { RemovalPolicy } from "aws-cdk-lib";
import { API_GATEWAY } from "../constants/constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { ENVIRONMENT_PARAMS } from "../constants/environments";

interface ApiGatewayProps {
  authService: HttpLambdaAuthorizer;
}

export class HourTrackerApiGateway extends Construct {
  public readonly httpApiGateway: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const customDomain = new DomainName(this, "DN", {
      domainName: StringParameter.valueForStringParameter(
        this,
        ENVIRONMENT_PARAMS.API_DOMAIN_NAME
      ),
      certificate: Certificate.fromCertificateArn(
        this,
        "CERT",
        StringParameter.valueForStringParameter(
          this,
          ENVIRONMENT_PARAMS.API_DOMAIN_CERT_ARN
        )
      ),
    });

    const gateway = new HttpApi(this, API_GATEWAY.NAME, {
      description: "REST API for hour tracker app",
      corsPreflight: {
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
      createDefaultStage: false,
      defaultAuthorizer: props.authService,
      disableExecuteApiEndpoint: true,
    });
    gateway.applyRemovalPolicy(RemovalPolicy.DESTROY);
    gateway.addStage("live", {
      stageName: "live",
      throttle: {
        rateLimit: 1,
        burstLimit: 1,
      },
      autoDeploy: true,
      domainMapping: {
        domainName: customDomain,
      },
    });
    this.httpApiGateway = gateway;
  }
}
