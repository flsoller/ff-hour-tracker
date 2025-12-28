/**
 * Generates a random string with a given prefix and optional length
 * Useful for creating unique test data that won't conflict across test runs
 * @param prefix - Prefix to add to the random string
 * @param length - Length of the random portion (default: 8)
 * @returns A string in the format `${prefix}_${randomString}`
 */
export function generateRandomString(prefix: string, length: number = 8): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${prefix}_${result}`;
}
