import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizerService } from './authorizer';
import { HourTrackerApiGateway } from './gateway';
import { UsersService } from './users';
import { HOUR_TRACKER } from '../constants/stacks';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { ENVIRONMENTS, ENVIRONMENT_PARAMS } from '../constants/environments';

export class HourTrackerApi extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hashOrVersion = new cdk.CfnParameter(this, 'hashOrVersion', {
      description: 'The version or hash used to reference the images',
      type: 'String',
    }).valueAsString;

    const dbConnectionString = ssm.StringParameter.valueForStringParameter(
      this,
      ENVIRONMENT_PARAMS[ENVIRONMENTS.TESTING].DATABASE_URL_KEY
    );
    const defaultAuthorizer = new AuthorizerService(
      this,
      HOUR_TRACKER.API_AUTHORIZER,
      {
        hashOrVersion,
        dbConnectionString,
      }
    );

    const apiGateway = new HourTrackerApiGateway(
      this,
      HOUR_TRACKER.API_GATEWAY,
      {
        authService: defaultAuthorizer.authorizer,
      }
    );

    new UsersService(this, HOUR_TRACKER.API_USERS, {
      apiGateway: apiGateway.httpApiGateway,
    });
  }
}
