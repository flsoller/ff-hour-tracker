import { APIRequest } from "../../common/types/request.type";

export async function getMembersPaginated(request: APIRequest) {
  console.log(request);

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok", testing: "response-testing" }),
    headers: { "Content-Type": "application/json" },
  };
}
