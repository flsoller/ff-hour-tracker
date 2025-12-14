import { db, DrizzleORM, models } from "@hour-tracker/db";
import { handler } from "../src";
import { createClerkPayload, mockVerifyToken } from "./helpers/clerk-mock";
import { createAuthorizerEvent, createOrganizationWithClerkId, createUserWithClerkId } from "./helpers/test-data";

// Mock @clerk/backend at module level
jest.mock("@clerk/backend", () => ({
  verifyToken: jest.fn(),
}));

describe("Authorizer", () => {
  describe("Token Verification", () => {
    it("should deny access when no token provided", async () => {
      const event = createAuthorizerEvent("", "/some/route", "POST");
      event.headers.authorization = undefined;

      const res = await handler(event);

      expect(res.isAuthorized).toBe(false);
      expect(res.context).toEqual({});
    });

    it("should deny access when token verification fails", async () => {
      mockVerifyToken(null);

      const event = createAuthorizerEvent("invalid_token", "/some/route", "POST");
      const res = await handler(event);

      expect(res.isAuthorized).toBe(false);
      expect(res.context).toEqual({});
    });

    it("should deny access when token has no organization", async () => {
      const payload = createClerkPayload({ clerkOrgId: "" });
      mockVerifyToken(payload);

      const event = createAuthorizerEvent("valid_token", "/some/route", "POST");
      const res = await handler(event);

      expect(res.isAuthorized).toBe(false);
      expect(res.context).toEqual({});
    });
  });

  describe("User/Org Sync - New Users", () => {
    it("should auto-create org and user on first request", async () => {
      const payload = createClerkPayload();
      mockVerifyToken(payload);

      const event = createAuthorizerEvent("valid_token", "/some/route", "POST");
      const res = await handler(event);

      expect(res.isAuthorized).toBe(true);
      expect(res.context).toMatchObject({
        userId: expect.any(String),
        organizationId: expect.any(String),
        role: "USER",
      });

      // Verify DB records were created
      const [org] = await db
        .select()
        .from(models.organizations)
        .where(
          DrizzleORM.eq(models.organizations.authProviderId, payload.clerkOrgId),
        );
      const [user] = await db
        .select()
        .from(models.users)
        .where(
          DrizzleORM.eq(models.users.authProviderId, payload.clerkUserId),
        );

      expect(org).toBeDefined();
      expect(org.name).toBe(payload.orgName);
      expect(user).toBeDefined();
      expect(user.emailAddress).toBe(payload.userEmail);
    });
  });

  describe("User/Org Sync - Existing Users", () => {
    it("should authorize existing active user", async () => {
      const payload = createClerkPayload();

      // Pre-create org and user in DB
      const org = await createOrganizationWithClerkId(payload.clerkOrgId);
      const user = await createUserWithClerkId(org.id, payload.clerkUserId);

      mockVerifyToken(payload);

      const event = createAuthorizerEvent("valid_token", "/some/route", "POST");
      const res = await handler(event);

      expect(res.isAuthorized).toBe(true);
      expect(res.context).toEqual({
        userId: user.id,
        organizationId: org.id,
        role: user.role,
      });
    });

    it("should deny access for inactive user", async () => {
      const payload = createClerkPayload();

      const org = await createOrganizationWithClerkId(payload.clerkOrgId);
      await createUserWithClerkId(org.id, payload.clerkUserId, { active: false });

      mockVerifyToken(payload);

      const event = createAuthorizerEvent("valid_token", "/some/route", "POST");
      const res = await handler(event);

      expect(res.isAuthorized).toBe(false);
      expect(res.context).toEqual({});
    });
  });
});
