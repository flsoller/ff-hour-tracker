import { db, DrizzleORM, models } from "@hour-tracker/db";
import { BadRequestError } from "@hour-tracker/lambda-api/errors";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { compare } from "bcryptjs";
import { SignInResponse } from "../common/types/signin.types";
import { createAccessToken } from "../services/jwt";

export async function handleSignIn(
  request: APIGatewayProxyEventV2,
): Promise<SignInResponse> {
  const { emailAddress = "", password = "" } = JSON.parse(request.body ?? "");

  const [user] = await db
    .select()
    .from(models.users)
    .where(DrizzleORM.eq(models.users.emailAddress, emailAddress))
    .limit(1);

  if (!user) {
    // Purposefully throwing bad request error to not give away too much info
    throw new BadRequestError("InvalidInformation");
  }

  const validCredentials = await compare(password, user.password);
  if (!validCredentials) {
    throw new BadRequestError("InvalidInformation");
  }

  return {
    accessToken: createAccessToken(user.id, user.organizationId),
  };
}
