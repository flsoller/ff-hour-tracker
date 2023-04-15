import api from '../utils/api';
import { Error } from '../types/ApiError';
import {
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
} from '@hour-tracker/core-types/api/members';
import { useUserStore } from '../stores/user';

const MEMBERS_API = 'v0/members';

async function getMembers(
  queryOptions: IGetMembersPaginatedReq
): Promise<[IGetMembersPaginatedRes | null, Error | null]> {
  const userStore = useUserStore();
  const { limit = '10', offset = '0', order = 'asc' } = queryOptions;
  const queryParams = new URLSearchParams({ limit, offset, order }).toString();
  const [data, error] = await api.get<IGetMembersPaginatedRes>(
    `${MEMBERS_API}?${queryParams}`,
    { headers: { authorization: `Bearer ${userStore.accessToken}` } }
  );

  return [data, error];
}

export { getMembers };
