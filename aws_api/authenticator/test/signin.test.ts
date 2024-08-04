import { Context } from "aws-lambda";
import {
  SignInEventBody,
  SignInResponse,
} from "../src/common/types/signin.types";
import { handler } from "../src";
import {
  createAuthenticatorEvent,
  createOrganizations,
  createUserForOrganization,
} from "./helpers/test-data";

describe("SignIn", () => {
  let orgId: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    orgId = organization.id;
  });

  describe("handleSignIn", () => {
    it("should return access token on successful login requests", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createAuthenticatorEvent<SignInEventBody>(
        {
          emailAddress: user.emailAddress,
          password: "12345",
        },
        "/auth/signin",
        "POST"
      );
      const res = (await handler(event, {} as Context)) as SignInResponse;
      expect(res.accessToken).toEqual(expect.any(String));
    });

    it("should return a 400 error when user does not exist", async () => {
      const event = createAuthenticatorEvent<SignInEventBody>(
        {
          emailAddress: "not-here@ghost.com",
          password: "abc",
        },
        "/auth/signin",
        "POST"
      );
      expect(await handler(event, {} as Context)).toMatchSnapshot();
    });

    it("should return a 400 error when password is incorrect", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createAuthenticatorEvent<SignInEventBody>(
        {
          emailAddress: user.emailAddress,
          password: "abc",
        },
        "/auth/signin",
        "POST"
      );
      expect(await handler(event, {} as Context)).toMatchSnapshot();
    });
  });
});
