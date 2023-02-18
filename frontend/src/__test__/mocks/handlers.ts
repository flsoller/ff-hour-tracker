import { AppConstants } from '../../utils/constants';
import { rest } from 'msw';

const MOCKED_ENDPOINT = AppConstants.apiUrl;

export const handlers = [
  // API test endpoints not implemented on server. Only for api module tests
  rest.get(`${MOCKED_ENDPOINT}/apioktest`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ key: 'value' }));
  }),
  rest.get(`${MOCKED_ENDPOINT}/apierrtest`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({ error: 'someError', additionalInfo: {} })
    );
  }),
  rest.get(`${MOCKED_ENDPOINT}/apierrtest2`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ some: 'err' }));
  }),
  rest.post(`${MOCKED_ENDPOINT}/apiposttest`, (req, res, ctx) => {
    return res(ctx.status(201));
  }),

  // Auth routes
  rest.post(`${MOCKED_ENDPOINT}/v0/auth/signin`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ accessToken: 'token' }));
  }),
];
