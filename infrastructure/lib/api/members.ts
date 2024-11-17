import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { MEMBERS_SERVICE } from "../constants/constructs";

interface MembersProps {
  hashOrVersion: string;
  dbConnectionString: string;
  apiGateway: HttpApi;
}

export class MembersService extends Construct {
  constructor(scope: Construct, id: string, props: MembersProps) {
    super(scope, id);

    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      `${id}-repo`,
      HOUR_TRACKER_ECR_REPO_NAMES.API_MEMBERS
    );

    const membersService = new lambda.DockerImageFunction(
      this,
      MEMBERS_SERVICE.NAME,
      {
        code: lambda.DockerImageCode.fromEcr(ecrRepo, {
          tagOrDigest: props.hashOrVersion,
        }),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          DATABASE_URL: props.dbConnectionString,
        },
      }
    );
    membersService.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const membersServiceIntegration = new HttpLambdaIntegration(
      MEMBERS_SERVICE.LAMBDA_INTEGRATION,
      membersService
    );

    props.apiGateway.addRoutes({
      integration: membersServiceIntegration,
      path: "/v1/members",
      methods: [HttpMethod.ANY],
    });
    props.apiGateway.addRoutes({
      integration: membersServiceIntegration,
      path: "/v1/members/{proxy+}",
      methods: [HttpMethod.ANY],
    });
  }
}
