import { request } from "@playwright/test";
import { createOrganization, createUser } from "./utils";

const API_TEST_ADMIN_USER = process.env.ADMIN_E2E_EMAIL;
const API_TEST_ADMIN_PW = process.env.ADMIN_E2E_PW;

/**
 * Login api user for api interaction and test data creation
 */
async function loginApiUser(email?: string, password?: string) {
  const URL = process.env.PLAYWRIGHT_TEST_API_URL;

  const context = await request.newContext();

  const res = await context.post(`${URL}/auth/signin`, {
    data: {
      emailAddress: email ?? API_TEST_ADMIN_USER,
      password: password ?? API_TEST_ADMIN_PW,
    },
  });

  const { accessToken } = await res.json();

  const authContext = await request.newContext({
    extraHTTPHeaders: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    URL,
    authContext,
  };
}

/**
 * Sets up a new user scoped to an organization
 */
async function setupUser() {
  const { URL, authContext } = await loginApiUser();

  const orgRes = await authContext.post(`${URL}/v0/organizations`, {
    data: {
      ...createOrganization(),
    },
  });
  const { id } = await orgRes.json();

  const user = createUser(id);
  const userRes = await authContext.post(`${URL}/v0/auth/register`, {
    data: {
      ...user,
    },
  });

  const { emailAddress } = await userRes.json();

  return {
    emailAddress,
    password: user.password,
  };
}

async function createMembersData(
  userEmail: string,
  userPassword: string,
  membersToCreate = [{}],
) {
  const { URL, authContext } = await loginApiUser(userEmail, userPassword);

  for (const member of membersToCreate) {
    await authContext.post(`${URL}/v1/members`, {
      data: {
        ...member,
      },
    });
  }
}

export { createMembersData, loginApiUser, setupUser };
