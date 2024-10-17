import { hash } from "bcryptjs";

/**
 * Hashes a password
 * @param password
 * @returns
 */
export async function hashPassword(password: string) {
  return hash(password, 12);
}
