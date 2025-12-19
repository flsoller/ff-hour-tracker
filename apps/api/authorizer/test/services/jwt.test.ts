import { verifyToken } from "@clerk/backend";
import { verifyAccessToken } from "../../src/services/jwt";
import { createClerkPayload } from "../helpers/clerk-mock";

jest.mock("@clerk/backend", () => ({
  verifyToken: jest.fn(),
}));

const mockedVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe("verifyAccessToken", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should pass authorizedParties when AUTHORIZED_PARTY env var is set", async () => {
    const payload = createClerkPayload();
    mockedVerifyToken.mockResolvedValue(payload as never);
    process.env.AUTHORIZED_PARTY = "https://example.com";

    await verifyAccessToken("test_token");

    expect(mockedVerifyToken).toHaveBeenCalledWith("test_token", {
      secretKey: process.env.JWT_SECRET,
      authorizedParties: ["https://example.com"],
    });
  });

  it("should not pass authorizedParties when AUTHORIZED_PARTY env var is not set", async () => {
    const payload = createClerkPayload();
    mockedVerifyToken.mockResolvedValue(payload as never);
    delete process.env.AUTHORIZED_PARTY;

    await verifyAccessToken("test_token");

    expect(mockedVerifyToken).toHaveBeenCalledWith("test_token", {
      secretKey: process.env.JWT_SECRET,
    });
  });

  it("should return parsed token payload on success", async () => {
    const payload = createClerkPayload();
    mockedVerifyToken.mockResolvedValue(payload as never);

    const result = await verifyAccessToken("test_token");

    expect(result).toEqual({
      clerkUserId: payload.clerkUserId,
      clerkOrgId: payload.clerkOrgId,
      orgName: payload.orgName,
      userEmail: payload.userEmail,
      userName: payload.userName,
      orgRole: payload.orgRole,
    });
  });

  it("should return null when token verification fails", async () => {
    mockedVerifyToken.mockRejectedValue(new Error("Invalid token"));

    const result = await verifyAccessToken("invalid_token");

    expect(result).toBeNull();
  });
});
