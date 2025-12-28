import { db, models } from "@hour-tracker/db";
import { handler } from "../../src";
import * as activityRepository from "../../src/common/repository/activity-type";
import {
  createActivityTypesForOrganization,
  createApiRequestEvent,
  createOrganizations,
  createUserForOrganization,
} from "../helpers/test-data";

describe("Update Activity Type", () => {
  let orgId: string;
  let userId: string;
  let role: string;
  let activityId: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    const [user] = await createUserForOrganization(organization!.id);
    const [activityType] = await createActivityTypesForOrganization(organization!.id, 1);

    orgId = organization!.id;
    userId = user!.id;
    role = user!.role;
    activityId = activityType!.id;
  });

  describe("updateActivityType", () => {
    it("should update an activity type with all new fields", async () => {
      const event = createApiRequestEvent(
        {
          activityName: "updated activity",
          activityDescription: "updated description",
          colorCode: "FF0000",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        { id: activityId },
      );
      const result = await handler(event);
      const expectedActivity = await activityRepository.getByName(orgId, "updated activity");

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          id: expectedActivity!.id,
          activityName: expectedActivity!.activityName,
          activityDescription: expectedActivity!.activityDescription,
          colorCode: expectedActivity!.colorCode,
        }),
      });
    });

    it("should update an activity type while keeping the same name", async () => {
      const originalActivity = await activityRepository.getByName(orgId, "A-0Activity");
      const event = createApiRequestEvent(
        {
          activityName: "A-0Activity",
          activityDescription: "new description",
          colorCode: "AABBCC",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        { id: activityId },
      );
      const result = await handler(event);
      const updatedActivity = await activityRepository.getByName(orgId, "A-0Activity");

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          id: updatedActivity!.id,
          activityName: "A-0Activity",
          activityDescription: "new description",
          colorCode: "AABBCC",
        }),
      });
      expect(updatedActivity!.id).toBe(originalActivity!.id);
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
      {
        activityName: "new activity",
        activityDescription: "a cool activity",
        colorCode: "F5492",
      },
      {
        activityName: "new activity",
        activityDescription: "a cool activity",
        colorCode: "F549277",
      },
      {
        activityName: "new activity",
        activityDescription: "a cool activity",
        colorCode: "GGGGGG",
      },
    ])("should return 400 if the request body is invalid", async (body) => {
      const event = createApiRequestEvent(
        body,
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        { id: activityId },
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

    it("should return 400 if activity ID is missing from path parameters", async () => {
      const event = createApiRequestEvent(
        {
          activityName: "updated activity",
          activityDescription: "updated description",
          colorCode: "FF0000",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        {},
      );
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "MissingActivityId",
          details: [],
        }),
      });
    });

    it("should return 404 if activity type does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const event = createApiRequestEvent(
        {
          activityName: "updated activity",
          activityDescription: "updated description",
          colorCode: "FF0000",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        { id: nonExistentId },
      );
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 404,
        body: JSON.stringify({
          message: "",
          details: [],
        }),
      });
    });

    it("should return 400 if updating to a name that already exists in the organization", async () => {
      await db
        .insert(models.activityTypes)
        .values({
          activityName: "Another Activity",
          activityDescription: "Description",
          organizationId: orgId,
          active: true,
          colorCode: "111111",
        })
        .returning();

      const event = createApiRequestEvent(
        {
          activityName: "Another Activity",
          activityDescription: "updated description",
          colorCode: "FF0000",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        { id: activityId },
      );
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "ActivityAlreadyExists",
          details: [],
        }),
      });
    });

    it("should return 404 when trying to update an activity from another organization", async () => {
      const [, otherOrganization] = await createOrganizations();
      const [otherUser] = await createUserForOrganization(otherOrganization!.id);

      const event = createApiRequestEvent(
        {
          activityName: "updated activity",
          activityDescription: "updated description",
          colorCode: "FF0000",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        {
          organizationId: otherOrganization!.id,
          userId: otherUser!.id,
          role: otherUser!.role,
        },
        { id: activityId },
      );
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 404,
        body: JSON.stringify({
          message: "",
          details: [],
        }),
      });
    });

    it("should return 500 for unexpected errors", async () => {
      const event = createApiRequestEvent(
        {
          activityName: "updated activity",
          activityDescription: "updated description",
          colorCode: "FF0000",
        },
        {},
        "/v1/activity-types/{id}",
        "PUT",
        { organizationId: orgId, userId, role },
        { id: activityId },
      );
      jest.spyOn(activityRepository, "updateById").mockRejectedValueOnce(new Error("Failed"));
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
