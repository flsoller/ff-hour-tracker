import { db, models } from "@hour-tracker/db";
import { hash } from "bcryptjs";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export async function createOrganizations() {
  const [organization] = await db
    .insert(models.organizations)
    .values({
      name: "organization",
      description: "organization description",
    })
    .returning();

  const [otherOrganization] = await db
    .insert(models.organizations)
    .values({
      name: "otherOrganization",
      description: "otherOrganization description",
    })
    .returning();

  return [organization, otherOrganization];
}

export async function createUserForOrganization(
  organizationId: string,
  overrides = {}
) {
  const pwHash = await hash("12345", 12);
  return db
    .insert(models.users)
    .values({
      emailAddress: "testuser@db.com",
      password: pwHash,
      name: "Mr. Test",
      organizationId,
      role: "USER",
      ...overrides,
    })
    .returning();
}

export function createAuthorizerEvent<T>(
  authorization: string,
  path: string,
  method: string
): APIGatewayProxyEventV2 {
  return {
    version: "2.0",
    routeKey: `${method} ${path}`,
    rawPath: path,
    rawQueryString: "",
    headers: {
      authorization: `Bearer ${authorization}`,
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "content-length": "58",
      "content-type": "application/json",
    },
    requestContext: {
      accountId: "1234",
      apiId: "1234",
      domainName: "abc",
      domainPrefix: "abc",
      http: {
        method,
        path: path,
        protocol: "HTTP/1.1",
        sourceIp: "123",
        userAgent: "PostmanRuntime/7.40.0",
      },
      requestId: "123",
      routeKey: `${method} ${path}`,
      stage: "$default",
      time: "29/Jul/2024:19:49:26 +0000",
      timeEpoch: 1722282566285,
    },
    body: JSON.stringify({}),
    isBase64Encoded: false,
  };
}
