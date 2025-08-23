import { handler } from "../../src/index";
import {
  createActivityTypesForOrganization,
  createApiRequestEvent,
  createOrganizations,
  createUserForOrganization,
} from "../helpers/test-data";

describe("Get activity types paginated", () => {
  let orgId: string;
  let otherOrgId: string;

  beforeEach(async () => {
    const [organization, otherOrganization] = await createOrganizations();
    orgId = organization!.id;
    otherOrgId = otherOrganization!.id;
  });

  describe("getActivityTypesPaginated", () => {
    it("should return empty array when no activity types exist", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createApiRequestEvent({}, {}, "/v1/activity-types", "GET", {
        organizationId: orgId,
        userId: user!.id,
        role: user!.role,
      });
      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          data: [],
          totalCount: 0,
        }),
      });
    });

    it("should return paginated activity types with default limit", async () => {
      const [user] = await createUserForOrganization(orgId);
      const activityTypes = await createActivityTypesForOrganization(orgId, 5);
      const event = createApiRequestEvent({}, {}, "/v1/activity-types", "GET", {
        organizationId: orgId,
        userId: user!.id,
        role: user!.role,
      });

      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          data: activityTypes,
          totalCount: activityTypes.length,
        }),
      });
    });

    it("should return paginated activity types with limit and offset", async () => {
      const [user] = await createUserForOrganization(orgId);
      const activityTypes = await createActivityTypesForOrganization(orgId, 5);
      const event = createApiRequestEvent(
        {},
        {
          limit: "1",
          offset: "0",
        },
        "/v1/activity-types",
        "GET",
        {
          organizationId: orgId,
          userId: user!.id,
          role: user!.role,
        },
      );

      const result = (await handler(event)) as { body: string };
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          data: activityTypes.slice(0, 1),
          totalCount: 5,
        }),
      });
      const responseBody = JSON.parse(result.body);
      expect(responseBody.data[0].activityName).toEqual("A-0Activity");
    });

    it("should return ordered activity types as specified in the query params", async () => {
      const [user] = await createUserForOrganization(orgId);
      await createActivityTypesForOrganization(orgId);
      const event = createApiRequestEvent(
        {},
        { limit: "1", offset: "0", order: "desc" },
        "/v1/activity-types",
        "GET",
        {
          organizationId: orgId,
          userId: user!.id,
          role: user!.role,
        },
      );

      const result = (await handler(event)) as { body: string };
      const responseBody = JSON.parse(result.body);
      expect(responseBody.data[0].activityName).toEqual("A-2Activity");
    });

    it("should throw bad request error when limit is not a number", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createApiRequestEvent(
        {},
        { limit: "not-a-number", offset: "0", order: "asc" },
        "/v1/activity-types",
        "GET",
        {
          organizationId: orgId,
          userId: user!.id,
          role: user!.role,
        },
      );

      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "InvalidQueryParams",
          details: [],
        }),
      });
    });

    it("should throw bad request error when offset is not a number", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createApiRequestEvent(
        {},
        { limit: "1", offset: "not-a-number", order: "asc" },
        "/v1/activity-types",
        "GET",
        {
          organizationId: orgId,
          userId: user!.id,
          role: user!.role,
        },
      );

      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "InvalidQueryParams",
          details: [],
        }),
      });
    });

    it("should not return data from another organization", async () => {
      await createActivityTypesForOrganization(orgId);
      const [user] = await createUserForOrganization(otherOrgId);
      const event = createApiRequestEvent(
        {},
        {
          limit: "1",
          offset: "0",
        },
        "/v1/activity-types",
        "GET",
        {
          organizationId: otherOrgId,
          userId: user!.id,
          role: user!.role,
        },
      );

      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          data: [],
          totalCount: 0,
        }),
      });
    });
  });
});
