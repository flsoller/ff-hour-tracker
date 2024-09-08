export const SIGNIN_ROUTE_KEY = "POST /auth/signin";

export interface SignInEventBody {
  emailAddress: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
}
