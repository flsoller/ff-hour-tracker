import { Context, APIGatewayProxyEventV2 } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<void> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
};
