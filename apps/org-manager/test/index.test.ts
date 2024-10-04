import { Context } from "aws-lambda";
import { handler } from "../src";

describe("Organization Manager", () => {
  it("should not fail", async () => {
    const spy = jest.spyOn(console, "log");
    await handler({ test: "payload" }, {} as Context);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Lambda invoked with:", {
      test: "payload",
    });
  });
});
