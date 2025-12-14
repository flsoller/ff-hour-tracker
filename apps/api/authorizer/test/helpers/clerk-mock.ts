import type { TokenPayload } from "../../src/types/context.type";

/**
 * Creates a mock Clerk token payload with sensible defaults
 */
export function createClerkPayload(
  overrides: Partial<TokenPayload> = {},
): TokenPayload {
  return {
    clerkUserId: "clerk_user_123",
    clerkOrgId: "clerk_org_456",
    orgName: "Test Organization",
    userEmail: "test@example.com",
    userName: "Test User",
    orgRole: "admin",
    ...overrides,
  };
}

/**
 * Configure the mocked verifyToken to return a specific payload or reject
 * @param payload - The payload to return, or null to simulate verification failure
 */
export function mockVerifyToken(payload: TokenPayload | null) {
  const { verifyToken } = jest.requireMock("@clerk/backend");
  if (payload) {
    verifyToken.mockResolvedValue({
      sub: payload.clerkUserId,
      orgId: payload.clerkOrgId,
      orgName: payload.orgName,
      userEmail: payload.userEmail,
      userName: payload.userName,
      orgRole: payload.orgRole,
    });
  } else {
    verifyToken.mockRejectedValue(new Error("Invalid token"));
  }
}
