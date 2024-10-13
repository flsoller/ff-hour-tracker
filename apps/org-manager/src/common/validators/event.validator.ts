import { EventPayload, LambdaActions } from "../types/actions.type";

/**
 * Verifies event action is included in defined LambdaActions
 * @param event Lambda invocation event
 * @returns
 */
function isValidAction(event: EventPayload): boolean {
  return Object.keys(LambdaActions).includes(event.action);
}

/**
 * Verifies all provided properties in the provided invocation event
 * @param event Lambda invocation event
 * @returns
 */
export function isValidLambdaEvent(event: EventPayload): boolean {
  return [isValidAction].every((validator) => validator(event));
}
