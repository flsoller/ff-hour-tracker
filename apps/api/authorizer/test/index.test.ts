import { sign } from "jsonwebtoken";
import { handler } from "../src";
import { createAuthorizerEvent, createOrganizations, createUserForOrganization } from "./helpers/test-data";

describe("Authorizer", () => {
  let orgId: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    orgId = organization!.id;
  });

  describe("authorize", () => {
    it("should grant access for valid token and active user", async () => {
      const [user] = await createUserForOrganization(orgId);
      const token = sign(
        {
          userId: user!.id,
          organizationId: user!.organizationId,
        },
        process.env.JWT_SECRET!,
      );

      const event = createAuthorizerEvent(token, "/some/route", "POST");
      const res = await handler(event);
      expect(res.isAuthorized).toBe(true);
      expect(res.context).toEqual({
        userId: user!.id,
        organizationId: user!.organizationId,
        role: user!.role,
      });
    });

    it("should prohibit access for invalid token and active user", async () => {
      const [user] = await createUserForOrganization(orgId);
      const token = sign(
        {
          userId: user!.id,
          organizationId: user!.organizationId,
        },
        "some_wrong_secret",
      );

      const event = createAuthorizerEvent(token, "/some/route", "POST");
      const res = await handler(event);
      expect(res.isAuthorized).toBe(false);
      expect(res.context).toStrictEqual({});
    });

    it("should prohibit access for valid token but inactive user", async () => {
      const [user] = await createUserForOrganization(orgId, { active: false });
      const token = sign(
        {
          userId: user!.id,
          organizationId: user!.organizationId,
        },
        process.env.JWT_SECRET!,
      );

      const event = createAuthorizerEvent(token, "/some/route", "POST");
      const res = await handler(event);
      expect(res.isAuthorized).toBe(false);
      expect(res.context).toStrictEqual({});
    });
  });
});
