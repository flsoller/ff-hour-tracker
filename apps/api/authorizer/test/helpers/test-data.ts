import { db, models } from "@hour-tracker/db";
import { APIGatewayProxyEventV2 } from "aws-lambda";

/**
 * Creates an organization with a Clerk authProviderId
 */
export async function createOrganizationWithClerkId(
  clerkOrgId: string,
  overrides: Partial<typeof models.organizations.$inferInsert> = {},
) {
  const [org] = await db
    .insert(models.organizations)
    .values({
      name: "Test Organization",
      authProviderId: clerkOrgId,
      ...overrides,
    })
    .returning();
  return org;
}

/**
 * Creates a user with a Clerk authProviderId under an existing organization
 */
export async function createUserWithClerkId(
  organizationId: string,
  clerkUserId: string,
  overrides: Partial<typeof models.users.$inferInsert> = {},
) {
  const [user] = await db
    .insert(models.users)
    .values({
      emailAddress: "testuser@example.com",
      name: "Test User",
      organizationId,
      authProviderId: clerkUserId,
      ...overrides,
    })
    .returning();
  return user;
}

export function createAuthorizerEvent(
  authorization: string,
  path: string,
  method: string,
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
