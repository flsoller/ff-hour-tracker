import { AppConstants } from './constants';

/**
 * Wrapper function for fetch api methods
 * @param endpoint - target URL endpoint for the api
 * @param options - request options
 */
async function _apiRequest<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const response = await fetch(`${AppConstants.apiUrl}/${endpoint}`, {
    ...options,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
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
    _apiRequest<T>(endpoint, { method: 'GET', ...options }),

  /**
   * POST method
   * @param endpoint - target URL endpoint
   * @param body - request body
   * @param options - optional request options
   */
  post: <TBody, TRes>(endpoint: string, body: TBody, options?: RequestInit) =>
    _apiRequest<TRes>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    }),
};

export default api;
