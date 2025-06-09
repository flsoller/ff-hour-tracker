import { handler } from "../../src";
import * as memberRepository from "../../src/common/repository/member";
import { createApiRequestEvent, createOrganizations, createUserForOrganization } from "../helpers/test-data";

describe("Create member", () => {
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

  describe("createMember", () => {
    it("should create a member", async () => {
      const event = createApiRequestEvent(
        {
          firstName: "Johnny",
          lastName: "Silverhand",
          emailAddress: "johnny.silverhand@example.com",
        },
        {},
        "/v1/members",
        "POST",
        {
          organizationId: orgId,
          userId,
          role,
        },
      );
      const result = await handler(event);
      const expectedMember = await memberRepository.getByEmailAddress(orgId, "johnny.silverhand@example.com");
      expect(result).toEqual({
        statusCode: 201,
        body: JSON.stringify({
          id: expectedMember!.id,
          firstName: expectedMember!.firstName,
          lastName: expectedMember!.lastName,
          emailAddress: expectedMember!.emailAddress,
        }),
      });
    });

    it.each([
      {
        firstName: "",
        lastName: "Silverhand",
        emailAddress: "johnny.silverhand@example.com",
      },
      {
        firstName: "Johnny",
        lastName: "",
        emailAddress: "johnny.silverhand@example.com",
      },
      {
        firstName: "Johnny",
        lastName: "Silverhand",
        emailAddress: "invalid-email",
      },
    ])("should return 400 if the request body is invalid", async (body) => {
      const event = createApiRequestEvent(
        body,
        {},
        "/v1/members",
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

    it("should return 400 if the email address is already in use", async () => {
      const event = createApiRequestEvent(
        {
          firstName: "Johnny",
          lastName: "Silverhand",
          emailAddress: "johnny.silverhand@example.com",
        },
        {},
        "/v1/members",
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
          message: "MemberAlreadyExists",
          details: [],
        }),
      });
    });

    it("should return a 500 if API request fails unexpectedly", async () => {
      const event = createApiRequestEvent(
        {
          firstName: "Johnny",
          lastName: "Silverhand",
          emailAddress: "johnny.silverhand@example.com",
        },
        {},
        "/v1/members",
        "POST",
        {
          organizationId: orgId,
          userId,
          role,
        },
      );
      jest.spyOn(memberRepository, "create").mockRejectedValueOnce(new Error("Failed to create member"));
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
