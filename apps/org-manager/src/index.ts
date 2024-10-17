import { Context } from "aws-lambda";
import { EventPayload, LambdaActions } from "./common/types/actions.type";
import { isValidLambdaEvent } from "./common/validators/event.validator";
import { manageOrganization } from "./features/manage-organization";

const EVENT_ACTION_MAP = {
  [LambdaActions.MANAGE_ORGANIZATION]: manageOrganization,
};

/**
 * Function handler
 * @param event
 * @param context
 * @returns
 */
export const handler = async (
  event: EventPayload,
  context: Context
): Promise<void> => {
  if (!isValidLambdaEvent(event)) {
    throw new Error(`Invalid Event Provided: ${event.action}`);
  }
  return EVENT_ACTION_MAP[event.action](event.payload);
};
