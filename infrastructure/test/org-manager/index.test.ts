import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { cdkResourceFinderWithTypeFilter } from "../helpers";
import { HourTrackerOrganizationManager } from "../../lib/org-manager";
import { ORGANIZATION_MANAGER } from "../../lib/constants/constructs";

let app: cdk.App;
let orgManagerStack: HourTrackerOrganizationManager;
let template: Template;

beforeEach(() => {
  app = new cdk.App({
    context: { "@aws-cdk/core:newStyleStackSynthesis": false },
  });
  orgManagerStack = new HourTrackerOrganizationManager(
    app,
    "HourTrackerOrganizationManager"
  );
  template = Template.fromStack(orgManagerStack);
});

describe("HourTrackerOrganizationManager", () => {
  it("should contain the correct Lambda properties", () => {
    const { DependsOn, ...attributesToCheck } = cdkResourceFinderWithTypeFilter(
      template,
      "AWS::Lambda::Function",
      ORGANIZATION_MANAGER.NAME
    );
    expect(attributesToCheck).toMatchSnapshot();
  });
});
