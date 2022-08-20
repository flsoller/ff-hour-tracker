import app from '../../app';
import supertest from 'supertest';
import {
  createUserForOrganization,
  loginTestUser,
  createOrganizations,
} from '../helpers/helpers';

describe('createOrganization', () => {
  let token: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    const testUser = await createUserForOrganization(organization.id);
    token = await loginTestUser(app, testUser.emailAddress);
  });

  it('should create an organization', async () => {
    const res = await supertest(app)
      .post('/api/v0/organizations')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'TestOrganiztion',
        description: 'I am a happy description',
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  it('should fail when required fields are missing', async () => {
    const res = await supertest(app)
      .post('/api/v0/organizations')
      .auth(token, { type: 'bearer' })
      .send({
        description: 'I am a happy description',
      });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      error: 'MissingInformation',
      additionalInfo: {},
    });
  });

  it('should fail when not authenticated', async () => {
    const res = await supertest(app)
      .post('/api/v0/organizations')
      .auth('faketoken', { type: 'bearer' })
      .send({
        name: 'TestOrganiztion',
        description: 'I am a happy description',
      });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      error: 'NotAuthorized',
      additionalInfo: {},
    });
  });
});
