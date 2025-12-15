import type {
  ICreateMemberReq,
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
  IMemberCreatedRes,
} from "@hour-tracker/core-types/members";
import type { Error } from "../types/ApiError";
import api from "../utils/api";
import { getAccessToken } from "./auth";

const MEMBERS_API = "v1/members";

async function getMembers(
  queryOptions: IGetMembersPaginatedReq,
): Promise<[IGetMembersPaginatedRes | null, Error | null]> {
  const { limit = "10", offset = "0", order = "asc" } = queryOptions;
  const queryParams = new URLSearchParams({ limit, offset, order }).toString();
  const accessToken = await getAccessToken();
  const [data, error] = await api.get<IGetMembersPaginatedRes>(
    `${MEMBERS_API}?${queryParams}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

async function addMember(
  params: ICreateMemberReq,
): Promise<[IMemberCreatedRes | null, Error | null]> {
  const accessToken = await getAccessToken();
  const [data, error] = await api.post<ICreateMemberReq, IMemberCreatedRes>(
    `${MEMBERS_API}`,
    params,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

export { addMember, getMembers };
