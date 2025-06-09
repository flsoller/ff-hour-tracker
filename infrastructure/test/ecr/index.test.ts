import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { HOUR_TRACKER_ECR_REPO_NAMES } from "../../lib/constants/ecr";
import { HourTrackerImageRepositories } from "../../lib/ecr";
import { cdkResourceFinder } from "../helpers";

let app: cdk.App;
let ecrStack: HourTrackerImageRepositories;
let template: Template;

beforeEach(() => {
  app = new cdk.App({
    context: { "@aws-cdk/core:newStyleStackSynthesis": false },
  });
  ecrStack = new HourTrackerImageRepositories(
    app,
    "HourTrackerImageRepository",
  );
  template = Template.fromStack(ecrStack);
});

describe("HourTrackerImageRepositories", () => {
  it("should contain the correct amount of repositories", () => {
    template.resourceCountIs("AWS::ECR::Repository", 4);
  });

  describe("API_AUTHORIZER", () => {
    it("should have the correct repository parameters", () => {
      const resource = cdkResourceFinder(
        template,
        HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHORIZER,
      );
      expect(resource).toMatchSnapshot();
    });
  });

  describe("API_AUTHENTICATOR", () => {
    it("should have the correct repository parameters", () => {
      const resource = cdkResourceFinder(
        template,
        HOUR_TRACKER_ECR_REPO_NAMES.API_AUTHENTICATOR,
      );
      expect(resource).toMatchSnapshot();
    });
  });

  describe("ORGANIZATION_MANAGER", () => {
    it("should have the correct repository parameters", () => {
      const resource = cdkResourceFinder(
        template,
        HOUR_TRACKER_ECR_REPO_NAMES.ORGANIZATION_MANAGER,
      );
      expect(resource).toMatchSnapshot();
    });
  });

  describe("MEMBERS_SERVICE", () => {
    it("should have the correct repository parameters", () => {
      const resource = cdkResourceFinder(
        template,
        HOUR_TRACKER_ECR_REPO_NAMES.API_MEMBERS,
      );
      expect(resource).toMatchSnapshot();
    });
  });
});
