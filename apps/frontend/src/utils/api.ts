import { Error } from "../types/ApiError";
import { AppConstants } from "./constants";

/**
 * Parses http response body or returns null for no-content responses
 * @param httpResponse - response from fetch request
 */
async function getResponseBody<T>(httpResponse: Response): Promise<T | null> {
  const responseText = await httpResponse.text();

  if (responseText.length) {
    return JSON.parse(responseText);
  }
  return null;
}

/**
 * Wrapper function for fetch api methods
 * @param endpoint - target URL endpoint for the api
 * @param options - request options
 */
async function _apiRequest<T>(
  endpoint: string,
  options: RequestInit
): Promise<[T | null, Error | null]> {
  try {
    const response = await fetch(`${AppConstants.apiUrl}/${endpoint}`, {
      ...options,
    });

    const body = await getResponseBody<T>(response);

    if (!response.ok) {
      const { error = "", additionalInfo = {} } = body as Error;
      return [null, { statusCode: response.status, error, additionalInfo }];
    }

    return [body as T, null];
  } catch (error) {
    return [null, error as unknown as Error];
  }
}

/**
 * API module exposing http methods
 */
const api = {
  /**
   * GET method
   * @param endpoint - target URL endpoint
   * @param options - optional request options
   */
  get: <T>(endpoint: string, options?: RequestInit) =>
    _apiRequest<T>(endpoint, { method: "GET", ...options }),

  /**
   * POST method
   * @param endpoint - target URL endpoint
   * @param body - request body
   * @param options - optional request options
   */
  post: <TBody, TRes>(endpoint: string, body: TBody, options?: RequestInit) =>
    _apiRequest<TRes>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }),
};

export default api;
