import {
  Context,
  APIGatewayProxyEventV2,
  APIGatewaySimpleAuthorizerResult,
} from 'aws-lambda';

function isValidToken(token: string | undefined) {
  return token === 'granted';
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewaySimpleAuthorizerResult> => {
  const token = event.headers.authorization;
  const isAuthorized = isValidToken(token);
  console.log(`AuthState: ${isAuthorized}`);
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  return {
    isAuthorized,
  };
};
