export interface UserContext {
  userId: string;
  organizationId: string;
  role: string;
}

export interface TokenPayload {
  clerkUserId: string;
  clerkOrgId: string;
  orgName: string;
  userEmail: string;
  userName: string;
  orgRole: string;
}
