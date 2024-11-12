import { verify } from "jsonwebtoken";

// Verify presented access token
export function verifyAccessToken(token: string) {
  try {
    return verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      organizationId: string;
    };
  } catch (error) {
    return {
      userId: null,
      organizationId: null,
    };
  }
}
