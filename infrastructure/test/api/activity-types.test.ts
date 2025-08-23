import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { HourTrackerApi } from "../../lib/api";
import { ACTIVITY_TYPES_SERVICE } from "../../lib/constants/constructs";
import { cdkResourceFinderWithTypeFilter } from "../helpers";

let app: cdk.App;
let apiStack: HourTrackerApi;
let template: Template;

beforeEach(() => {
  app = new cdk.App({
    context: { "@aws-cdk/core:newStyleStackSynthesis": false },
  });
  apiStack = new HourTrackerApi(app, "HourTrackerApi");
  template = Template.fromStack(apiStack);
});

describe("ActivityTypesServiceLambda", () => {
  it("should contain the correct Lambda properties", () => {
    const { DependsOn, ...attributesToCheck } = cdkResourceFinderWithTypeFilter(
      template,
      "AWS::Lambda::Function",
      ACTIVITY_TYPES_SERVICE.NAME,
    );
    // Verify DependsOn is present but exclude it from snapshot
    expect(DependsOn).toBeDefined();
    expect(attributesToCheck).toMatchSnapshot();
  });
});
