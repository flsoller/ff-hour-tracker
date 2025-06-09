import { ISignIn, ISignInSuccess } from "../../../../packages/types/api/auth";
import { Error } from "../types/ApiError";
import api from "../utils/api";

async function signIn(
  credentials: ISignIn,
): Promise<[ISignInSuccess | null, Error | null]> {
  const { emailAddress, password } = credentials;
  const [data, error] = await api.post<ISignIn, ISignInSuccess>(
    "v0/auth/signin",
    {
      emailAddress,
      password,
    },
  );

  return [data, error];
}

export { signIn };
