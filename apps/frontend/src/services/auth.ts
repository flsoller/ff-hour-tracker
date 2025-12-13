import type { ISignIn, ISignInSuccess } from "@hour-tracker/core-types/auth";
import type { Error } from "../types/ApiError";
import api from "../utils/api";

async function signIn(
  credentials: ISignIn,
): Promise<[ISignInSuccess | null, Error | null]> {
  const { emailAddress, password } = credentials;
  const [data, error] = await api.post<ISignIn, ISignInSuccess>(
    "auth/signin",
    {
      emailAddress,
      password,
    },
  );

  return [data, error];
}

export { signIn };
