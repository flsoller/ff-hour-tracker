#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGwV2Stack } from '../stacks/api_gw-stack';
import { AuthStack } from '../stacks/auth-stack';
import { UsersStack } from '../stacks/users-stack';

const app = new cdk.App();

const AuthServiceStack = new AuthStack(app, 'AuthStack');

const ApiGatewayStack = new ApiGwV2Stack(app, 'ApiStack', {
  authService: AuthServiceStack.authorizer,
});

new UsersStack(app, 'UsersStack', {
  apiGateway: ApiGatewayStack.httpApiGateway,
});

app.synth();
