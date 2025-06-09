import { handler } from "../../src/index";
import {
  createApiRequestEvent,
  createMembersForOrganization,
  createOrganizations,
  createUserForOrganization,
} from "../helpers/test-data";

describe("Get members paginated", () => {
  let orgId: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    orgId = organization!.id;
  });

  describe("getMembersPaginated", () => {
    it("should return empty array when no members exist", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createApiRequestEvent({}, {}, "/v1/members", "GET", {
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

    it("should return paginated members", async () => {
      const [user] = await createUserForOrganization(orgId);
      const members = await createMembersForOrganization(orgId);
      const event = createApiRequestEvent({}, {}, "/v1/members", "GET", {
        organizationId: orgId,
        userId: user!.id,
        role: user!.role,
      });

      const result = await handler(event);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          data: members,
          totalCount: members.length,
        }),
      });
    });

    it("should return paginated members with limit and offset", async () => {
      const [user] = await createUserForOrganization(orgId);
      const members = await createMembersForOrganization(orgId);
      const event = createApiRequestEvent(
        {},
        {
          limit: "1",
          offset: "0",
        },
        "/v1/members",
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
          data: members.slice(0, 1),
          totalCount: 1,
        }),
      });
      const responseBody = JSON.parse(result.body);
      expect(responseBody.data[0].firstName).toEqual("John");
    });

    it("should return ordered members as specified in the query params", async () => {
      const [user] = await createUserForOrganization(orgId);
      await createMembersForOrganization(orgId);
      const event = createApiRequestEvent(
        {},
        { limit: "1", offset: "0", order: "desc" },
        "/v1/members",
        "GET",
        {
          organizationId: orgId,
          userId: user!.id,
          role: user!.role,
        },
      );

      const result = (await handler(event)) as { body: string };
      const responseBody = JSON.parse(result.body);
      expect(responseBody.data[0].firstName).toEqual("Jane");
    });

    it("should throw bad request error when limit is not a number", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createApiRequestEvent(
        {},
        { limit: "not-a-number", offset: "0", order: "asc" },
        "/v1/members",
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
        "/v1/members",
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
  });
});
