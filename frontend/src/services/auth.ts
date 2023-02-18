import api from '../utils/api';
import { Error } from '../types/ApiError';
import { ISignIn, ISignInSuccess } from '@hour-tracker/core-types/api/auth';

async function signIn(
  credentials: ISignIn
): Promise<[ISignInSuccess | null, Error | null]> {
  const { emailAddress, password } = credentials;
  const [data, error] = await api.post<ISignIn, ISignInSuccess>(
    'v0/auth/signin',
    {
      emailAddress,
      password,
    }
  );

  return [data, error];
}

export { signIn };
