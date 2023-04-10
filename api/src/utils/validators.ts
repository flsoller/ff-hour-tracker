function isTypeOfNumbers(checkTypes: unknown[] = []) {
  return checkTypes.every((item) => Number.isInteger(item));
}

function isValidOrderQuery(query = '') {
  return ['asc', 'desc'].includes(query);
}

export { isTypeOfNumbers, isValidOrderQuery };
