export interface IRegisterUser {
  emailAddress: string;
  name?: string;
  password: string;
  orgId: string;
  role?: any;
}

export interface IUserCreated {
  emailAddress: string;
}

export interface IExpressReqUser {
  id: string;
  orgId: string;
  emailAddress: string;
  role: string;
}

export interface ISignIn {
  emailAddress: string;
  password: string;
}

export interface ISignInSuccess {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenSuccess {
  accessToken: string;
}
