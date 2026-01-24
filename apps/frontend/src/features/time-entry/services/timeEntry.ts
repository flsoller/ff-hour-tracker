import { getAccessToken } from "@/services/auth";
import type { Error } from "@/types/ApiError";
import api from "@/utils/api";
import type { ICreateTimelogBatchRes, ICreateTimelogReq } from "@hour-tracker/core-types/timelogs";

const TIMELOGS_API = "v1/timelogs";

/**
 * Creates time log entries via batch API
 * POST /api/v1/timelogs/batch
 *
 * @param entries - Array of time log entries (one per member)
 * @returns Tuple of [response, error] following project API pattern
 */
async function createTimeEntries(
  entries: ICreateTimelogReq[],
): Promise<[ICreateTimelogBatchRes | null, Error | null]> {
  const accessToken = await getAccessToken();

  const [data, error] = await api.post<
    { entries: ICreateTimelogReq[] },
    ICreateTimelogBatchRes
  >(
    `${TIMELOGS_API}/batch`,
    { entries },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return [data, error];
}

export { createTimeEntries };
