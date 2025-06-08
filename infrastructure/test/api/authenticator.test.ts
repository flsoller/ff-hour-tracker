import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { HourTrackerApi } from "../../lib/api";
import { cdkResourceFinderWithTypeFilter } from "../helpers";
import { AUTHENTICATOR_SERVICE } from "../../lib/constants/constructs";

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

describe("AuthenticatorLambda", () => {
  it("should contain the correct Lambda properties", () => {
    const { DependsOn, ...attributesToCheck } = cdkResourceFinderWithTypeFilter(
      template,
      "AWS::Lambda::Function",
      AUTHENTICATOR_SERVICE.NAME
    );
    // Verify DependsOn is present but exclude it from snapshot
    expect(DependsOn).toBeDefined();
    expect(attributesToCheck).toMatchSnapshot();
  });
});
