import { verifyToken } from "@clerk/backend";
import { SKIP_AUTHORIZED_PARTY } from "../constants/globals";
import { TokenPayload } from "../types/context.type";

/**
 * Checks the JWT against the secret
 * @param token
 * @returns
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  const limitToAuthorizedParty = process.env.AUTHORIZED_PARTY !== SKIP_AUTHORIZED_PARTY;

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.JWT_SECRET,
      ...(limitToAuthorizedParty ? { authorizedParties: [process.env.AUTHORIZED_PARTY!] } : {}),
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
