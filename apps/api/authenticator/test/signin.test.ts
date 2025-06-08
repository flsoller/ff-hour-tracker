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
import { logger } from "@hour-tracker/logger";
import { db } from "@hour-tracker/db";

describe("SignIn", () => {
  let orgId: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    orgId = organization!.id;
  });

  describe("handleSignIn", () => {
    it("should return access token on successful login requests", async () => {
      const [user] = await createUserForOrganization(orgId);
      const event = createAuthenticatorEvent<SignInEventBody>(
        {
          emailAddress: user!.emailAddress,
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
          emailAddress: user!.emailAddress,
          password: "abc",
        },
        "/auth/signin",
        "POST"
      );
      expect(await handler(event, {} as Context)).toMatchSnapshot();
    });

    it("should return a 500 error when there is an internal server error", async () => {
      const loggerSpy = jest.spyOn(logger, "error");
      jest.spyOn(db, "select").mockImplementationOnce(() => {
        throw new Error("Database connection failed");
      });
      const event = createAuthenticatorEvent<SignInEventBody>(
        {
          emailAddress: "not-here@ghost.com",
          password: "abc",
        },
        "/auth/signin",
        "POST"
      );
      const response = await handler(event, {} as Context);
      expect(response).toMatchObject({
        statusCode: 500,
        body: JSON.stringify({
          message: "API error while processing request",
          details: [],
        }),
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
        }),
        "InternalServerError"
      );
    });
  });
});
