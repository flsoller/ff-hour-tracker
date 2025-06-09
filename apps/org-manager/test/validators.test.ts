import { LambdaActions } from "../src/common/types/actions.type";
import { isValidLambdaEvent } from "../src/common/validators/event.validator";

describe("Validators", () => {
  describe("isValidLambdaEvent", () => {
    it.each(Object.keys(LambdaActions))(
      "should return true when lambda action is allowed: %s",
      (action) => {
        const testAction = action as keyof typeof LambdaActions;
        expect(isValidLambdaEvent({ action: testAction, payload: {} }));
      },
    );
  });
});
