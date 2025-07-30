import { http, HttpResponse } from "msw";
import { AppConstants } from "../../utils/constants";

const MOCKED_ENDPOINT = AppConstants.apiUrl;

export const handlers = [
  // API test endpoints not implemented on server. Only for api module tests
  http.get(`${MOCKED_ENDPOINT}/apioktest`, () => {
    return HttpResponse.json({ key: "value" });
  }),
  http.get(`${MOCKED_ENDPOINT}/apierrtest`, () => {
    return HttpResponse.json(
      { error: "someError", additionalInfo: {} },
      { status: 400 },
    );
  }),
  http.get(`${MOCKED_ENDPOINT}/apierrtest2`, () => {
    return HttpResponse.json({ some: "err" }, { status: 500 });
  }),
  http.post(`${MOCKED_ENDPOINT}/apiposttest`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  // Auth routes
  http.post(`${MOCKED_ENDPOINT}/auth/signin`, () => {
    return HttpResponse.json({ accessToken: "token" });
  }),

  // Members routes
  http.get(`${MOCKED_ENDPOINT}/v1/members`, () => {
    return HttpResponse.json({
      data: [
        {
          firstName: "Paige",
          lastName: "Turner",
          emailAddress: "pt@mail.com",
        },
      ],
      totalCount: 1,
    });
  }),
  http.post(`${MOCKED_ENDPOINT}/v1/members`, () => {
    return HttpResponse.json({
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john@example.com",
    }, { status: 201 });
  }),
];
