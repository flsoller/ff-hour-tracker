import api from '../utils/api';
import { ISignIn, ISignInSuccess } from '@hour-tracker/core-types/api/auth';

async function signIn(credentials: ISignIn) {
  const { emailAddress, password } = credentials;
  const { accessToken, refreshToken } = await api.post<ISignIn, ISignInSuccess>(
    'v0/auth/signin',
    { emailAddress, password }
  );
}

export { signIn };
