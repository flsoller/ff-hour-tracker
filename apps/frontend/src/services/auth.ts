/**
 * Auth service that accesses Clerk directly.
 * This can be used anywhere without needing Vue's component context.
 */

export async function getAccessToken(): Promise<string | null> {
  try {
    const token = await window.Clerk?.session?.getToken();
    return token ?? null;
  } catch {
    return null;
  }
}
