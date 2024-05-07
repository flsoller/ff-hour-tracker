import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizerService } from './authorizer';
import { HourTrackerApiGateway } from './gateway';
import { UsersService } from './users';
import { HOUR_TRACKER } from '../constants/stacks';

export class HourTrackerApi extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultAuthorizer = new AuthorizerService(
      this,
      HOUR_TRACKER.API_AUTHORIZER
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
