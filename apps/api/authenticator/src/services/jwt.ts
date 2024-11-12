import { sign } from "jsonwebtoken";

// Create access token with user information
export function createAccessToken(userId: string, organizationId: string) {
  return sign(
    {
      userId,
      organizationId,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
}
