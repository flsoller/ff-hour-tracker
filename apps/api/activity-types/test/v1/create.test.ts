import { handler } from "../../src";
import * as activityRepository from "../../src/common/repository/activity-type";
import { createApiRequestEvent, createOrganizations, createUserForOrganization } from "../helpers/test-data";

describe("Create Activity Type", () => {
  let orgId: string;
  let userId: string;
  let role: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    const [user] = await createUserForOrganization(organization!.id);
    orgId = organization!.id;
    userId = user!.id;
    role = user!.role;
  });

  describe("createActivityType", () => {
    it("should create a new activity type", async () => {
      const event = createApiRequestEvent(
        {
          activityName: "new activity",
          activityDescription: "a cool activity",
          colorCode: "F54927",
        },
        {},
        "/v1/activity-types",
        "POST",
        {
          organizationId: orgId,
          userId,
          role,
        },
      );
      const result = await handler(event);
      const expectedActivity = await activityRepository.getByName(orgId, "new activity");
      expect(result).toEqual({
        statusCode: 201,
        body: JSON.stringify({
          id: expectedActivity!.id,
          activityName: expectedActivity!.activityName,
          activityDescription: expectedActivity!.activityDescription,
          colorCode: expectedActivity!.colorCode,
        }),
      });
    });

    it.each([
      {
        activityName: "",
        activityDescription: "a cool activity",
        colorCode: "F54927",
      },
      {
        activityName: "new activity",
        activityDescription: "",
        colorCode: "F54927",
      },
      {
        activityName: "new activity",
        activityDescription: "a cool activity",
        colorCode: "",
      },
      {
        activityName: "new activity",
        activityDescription: "a cool activity",
        colorCode: "&*&*&*",
      },
    ])("should return 400 if the request body is invalid", async (body) => {
      const event = createApiRequestEvent(
        body,
        {},
        "/v1/activity-types",
        "POST",
        {
          organizationId: orgId,
          userId,
          role,
        },
      );
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "InvalidRequest",
          details: [],
        }),
      });
    });

    it("should return 400 if activity type already exists", async () => {
      const event = createApiRequestEvent(
        {
          activityName: "new activity",
          activityDescription: "a cool activity",
          colorCode: "F54927",
        },
        {},
        "/v1/activity-types",
        "POST",
        {
          organizationId: orgId,
          userId,
          role,
        },
      );
      await handler(event);
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "ActivityAlreadyExists",
          details: [],
        }),
      });
    });

    it("should return 500 for unexpected errors", async () => {
      const event = createApiRequestEvent(
        {
          activityName: "new activity",
          activityDescription: "a cool activity",
          colorCode: "F54927",
        },
        {},
        "/v1/activity-types",
        "POST",
        {
          organizationId: orgId,
          userId,
          role,
        },
      );
      jest.spyOn(activityRepository, "create").mockRejectedValueOnce(new Error("Failed"));
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          message: "API error while processing request",
          details: [],
        }),
      });
    });
  });
});
