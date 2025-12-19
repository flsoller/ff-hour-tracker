import { verifyToken } from "@clerk/backend";
import { TokenPayload } from "../types/context.type";

/**
 * Checks the JWT against the secret
 * @param token
 * @returns
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.JWT_SECRET,
    });
    return {
      clerkUserId: payload.clerkUserId as string,
      clerkOrgId: payload.clerkOrgId as string,
      orgName: payload.orgName as string,
      userEmail: payload.userEmail as string,
      userName: payload.userName as string,
      orgRole: payload.orgRole as string,
    };
  } catch {
    return null;
  }
}
