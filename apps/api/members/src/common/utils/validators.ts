/**
 * Check if the checkTypes are of type number
 * @param checkTypes - The types to check
 * @returns True if the checkTypes are of type number, false otherwise
 */
export function isTypeOfNumbers(checkTypes: unknown[] = []) {
  return checkTypes.every((item) => Number.isInteger(item));
}

/**
 * Check if the order query is valid
 * @param query - The order query
 * @returns True if the order query is valid, false otherwise
 */
export function isValidOrderQuery(query = "") {
  return ["asc", "desc"].includes(query);
}

/**
 * Validate the email address
 * @param email - The email address to validate
 * @returns True if the email address is valid, false otherwise
 */
export function validateEmailRegex(email: string) {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
}
