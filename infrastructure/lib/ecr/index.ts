import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../constants/ecr";

const defaultVersionLifecycle: cdk.aws_ecr.LifecycleRule = {
  description: "Keep max 2 versioned images identified by 'vX.X.X' pattern",
  maxImageCount: 2,
  tagPatternList: ["v*.*.*"],
  rulePriority: 1,
};

const defaultLifecycle: cdk.aws_ecr.LifecycleRule = {
  description: "Keep max 1 image that is not a tagged version",
  maxImageCount: 1,
  rulePriority: 2,
};

export class HourTrackerImageRepositories extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Authorizer ECR image repo
    new ecr.Repository(this, HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER, {
      repositoryName: HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER,
      emptyOnDelete: true,
      imageScanOnPush: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [defaultVersionLifecycle, defaultLifecycle],
    });

    // Members Service ECR image repo
    new ecr.Repository(this, HOUR_TRACKER_ECR_REPO_NAMES.API_MEMBERS, {
      repositoryName: HOUR_TRACKER_ECR_REPO_NAMES.API_MEMBERS,
      emptyOnDelete: true,
      imageScanOnPush: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [defaultVersionLifecycle, defaultLifecycle],
    });

    // Activity Type Service ECR image repo
    new ecr.Repository(this, HOUR_TRACKER_ECR_REPO_NAMES.API_ACTIVITY_TYPES, {
      repositoryName: HOUR_TRACKER_ECR_REPO_NAMES.API_ACTIVITY_TYPES,
      emptyOnDelete: true,
      imageScanOnPush: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [defaultVersionLifecycle, defaultLifecycle],
    });
  }
}
