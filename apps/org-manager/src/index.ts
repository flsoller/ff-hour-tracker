import { Context } from "aws-lambda";

export const handler = async (
  event: unknown,
  context: Context
): Promise<void> => {
  try {
    console.log("Lambda invoked with:", event);
  } catch (error) {
    console.error("Error during");
  }
};
