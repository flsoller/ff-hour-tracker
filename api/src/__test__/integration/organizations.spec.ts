import app from '../../app';
import supertest from 'supertest';
import {
  createUserForOrganization,
  loginTestUser,
  createOrganizations,
} from '../helpers/helpers';
import { Role, User } from '@prisma/client';

describe('createOrganization', () => {
  const ROUTE = '/api/v0/organizations';
  let token: string;
  let testUser: User;
  let adminUser: User;
  let adminUserToken: string;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    testUser = await createUserForOrganization(organization.id);
    adminUser = await createUserForOrganization(organization.id, {
      emailAddress: 'admin@user.com',
      role: Role.ADMIN,
    });
    token = loginTestUser(testUser.id);
    adminUserToken = loginTestUser(adminUser.id);
  });

  it('should create an organization', async () => {
    const res = await supertest(app)
      .post(ROUTE)
      .auth(adminUserToken, { type: 'bearer' })
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
      .post(ROUTE)
      .auth(adminUserToken, { type: 'bearer' })
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
      .post(ROUTE)
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

  it('should only allow admin users to create a new organization', async () => {
    const res = await supertest(app)
      .post(ROUTE)
      .auth(token, { type: 'bearer' })
      .send({
        name: 'TestOrganiztion',
        description: 'I am a happy description',
      });

    expect(res.status).toBe(403);
    expect(res.body).toStrictEqual({
      error: 'NotAuthorized',
      additionalInfo: {},
    });
  });
});
