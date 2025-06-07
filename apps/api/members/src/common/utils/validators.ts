/**
 * Check if the checkTypes are of type number
 * @param checkTypes - The types to check
 * @returns True if the checkTypes are of type number, false otherwise
 */
function isTypeOfNumbers(checkTypes: unknown[] = []) {
  return checkTypes.every((item) => Number.isInteger(item));
}

/**
 * Check if the order query is valid
 * @param query - The order query
 * @returns True if the order query is valid, false otherwise
 */
function isValidOrderQuery(query = "") {
  return ["asc", "desc"].includes(query);
}

export { isTypeOfNumbers, isValidOrderQuery };
