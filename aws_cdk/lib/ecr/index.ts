import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import { HOUR_TRACKER_ECR_REPO_NAMES } from '../constants/ecr';

export class HourTrackerImageRepositories extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Authorizer ECR image repo
    new ecr.Repository(this, HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER, {
      repositoryName: HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER,
      emptyOnDelete: true,
      imageScanOnPush: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
