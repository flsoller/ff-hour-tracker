import type {
  IActivityCreatedRes,
  ICreateActivityReq,
  IGetActivitiesReq,
  IGetActivitiesRes,
} from "@hour-tracker/core-types/activities";
import type { Error } from "../types/ApiError";
import api from "../utils/api";
import { getAccessToken } from "./auth";

const ACTIVITIES_API = "v1/activity-types";

async function getActivities(
  queryOptions: IGetActivitiesReq,
): Promise<[IGetActivitiesRes | null, Error | null]> {
  const { limit = "10", offset = "0", order = "asc" } = queryOptions;
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order,
  }).toString();
  const accessToken = await getAccessToken();
  const [data, error] = await api.get<IGetActivitiesRes>(
    `${ACTIVITIES_API}?${queryParams}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

async function addActivity(
  params: ICreateActivityReq,
): Promise<[IActivityCreatedRes | null, Error | null]> {
  const accessToken = await getAccessToken();
  const [data, error] = await api.post<ICreateActivityReq, IActivityCreatedRes>(
    `${ACTIVITIES_API}`,
    params,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

async function updateActivity(
  id: string,
  params: ICreateActivityReq,
): Promise<[IActivityCreatedRes | null, Error | null]> {
  const accessToken = await getAccessToken();
  const [data, error] = await api.put<ICreateActivityReq, IActivityCreatedRes>(
    `${ACTIVITIES_API}/${id}`,
    params,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

export { addActivity, getActivities, updateActivity };
