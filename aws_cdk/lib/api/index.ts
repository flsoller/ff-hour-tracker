import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizerService } from './authorizer';
import { HourTrackerApiGateway } from './gateway';
import { UsersService } from './users';
import { HOUR_TRACKER } from '../constants/stacks';

export class HourTrackerApi extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hashOrVersion = new cdk.CfnParameter(this, 'hashOrVersion', {
      description: 'The version or hash used to reference the images',
      type: 'String',
    });

    const defaultAuthorizer = new AuthorizerService(
      this,
      HOUR_TRACKER.API_AUTHORIZER,
      {
        hashOrVersion,
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
