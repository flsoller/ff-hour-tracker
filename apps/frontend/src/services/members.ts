import {
  ICreateMemberReq,
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
  IMemberCreatedRes,
} from "../../../../packages/types/api/members";
import { Error } from "../types/ApiError";
import api from "../utils/api";

const MEMBERS_API = "v1/members";

async function getMembers(
  queryOptions: IGetMembersPaginatedReq,
  accessToken: string | null,
): Promise<[IGetMembersPaginatedRes | null, Error | null]> {
  const { limit = "10", offset = "0", order = "asc" } = queryOptions;
  const queryParams = new URLSearchParams({ limit, offset, order }).toString();
  const [data, error] = await api.get<IGetMembersPaginatedRes>(
    `${MEMBERS_API}?${queryParams}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

async function addMember(
  params: ICreateMemberReq,
  accessToken: string | null,
): Promise<[IMemberCreatedRes | null, Error | null]> {
  const [data, error] = await api.post<ICreateMemberReq, IMemberCreatedRes>(
    `${MEMBERS_API}`,
    params,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

export { addMember, getMembers };
