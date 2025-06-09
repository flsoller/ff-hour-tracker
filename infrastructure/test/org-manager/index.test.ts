import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ORGANIZATION_MANAGER } from "../../lib/constants/constructs";
import { HourTrackerOrganizationManager } from "../../lib/org-manager";
import { cdkResourceFinderWithTypeFilter } from "../helpers";

let app: cdk.App;
let orgManagerStack: HourTrackerOrganizationManager;
let template: Template;

beforeEach(() => {
  app = new cdk.App({
    context: { "@aws-cdk/core:newStyleStackSynthesis": false },
  });
  orgManagerStack = new HourTrackerOrganizationManager(
    app,
    "HourTrackerOrganizationManager",
  );
  template = Template.fromStack(orgManagerStack);
});

describe("HourTrackerOrganizationManager", () => {
  it("should contain the correct Lambda properties", () => {
    const { DependsOn, ...attributesToCheck } = cdkResourceFinderWithTypeFilter(
      template,
      "AWS::Lambda::Function",
      ORGANIZATION_MANAGER.NAME,
    );
    // Verify DependsOn is present but exclude it from snapshot
    expect(DependsOn).toBeDefined();
    expect(attributesToCheck).toMatchSnapshot();
  });
});
