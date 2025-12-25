import { RemovalPolicy } from "aws-cdk-lib";
import { CorsHttpMethod, DomainName, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { API_GATEWAY } from "../constants/constructs";
import { ENVIRONMENT_PARAMS } from "../constants/environments";
import { LOGICAL_ID } from "../constants/logical-id";

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
        ENVIRONMENT_PARAMS.API_DOMAIN_NAME,
      ),
      certificate: Certificate.fromCertificateArn(
        this,
        "CERT",
        StringParameter.valueForStringParameter(
          this,
          ENVIRONMENT_PARAMS.API_DOMAIN_CERT_ARN,
        ),
      ),
    });

    const corsOriginConfig = StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS.HOUR_TRACKER_API_CORS_ORIGIN,
    );

    const gateway = new HttpApi(this, API_GATEWAY.NAME, {
      description: "REST API for hour tracker app",
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowOrigins: corsOriginConfig.split(","),
      },
      createDefaultStage: false,
      defaultAuthorizer: props.authService,
      disableExecuteApiEndpoint: true,
      apiName: LOGICAL_ID.HOUR_TRACKER_API_GATEWAY,
    });

    gateway.applyRemovalPolicy(RemovalPolicy.DESTROY);
    gateway.addStage("live", {
      stageName: "live",
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
      autoDeploy: true,
      domainMapping: {
        domainName: customDomain,
      },
    });
    this.httpApiGateway = gateway;
  }
}
