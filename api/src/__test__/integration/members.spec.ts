import app from '../../app';
import supertest from 'supertest';
import { prisma } from '../../utils/prisma';
import {
  createOrganizations,
  createUserForOrganization,
  loginTestUser,
} from '../helpers/helpers';
import { Organization } from '@prisma/client';

describe('createMember', () => {
  const ROUTE = '/api/v0/members';
  let organization: Organization;
  let otherOrganization: Organization;
  let token: string;

  beforeEach(async () => {
    [organization, otherOrganization] = await createOrganizations();
    const testUser = await createUserForOrganization(organization.id);
    token = await loginTestUser(app, testUser.emailAddress);
  });

  it('should create one member', async () => {
    const res = await supertest(app)
      .post(ROUTE)
      .auth(token, { type: 'bearer' })
      .send({
        firstName: 'Arthur',
        lastName: 'Morgan',
        emailAddress: 'arthur@coolguy.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchSnapshot({
      id: expect.any(String),
    });
    expect(await prisma.member.count()).toBe(1);
  });

  it('should fail when required fields are missing', async () => {
    const res = await supertest(app)
      .post(ROUTE)
      .auth(token, { type: 'bearer' })
      .send({
        firstName: 'Arthur',
        emailAddress: 'arthur@coolguy.com',
      });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      error: 'MissingInformation',
      additionalInfo: {},
    });
  });

  it('should not create member when email not unique for organization', async () => {
    const emailAddress = 'myemail@org.com';
    await prisma.member.create({
      data: {
        firstName: 'first',
        lastName: 'last',
        orgId: organization.id,
        emailAddress,
      },
    });

    const res = await supertest(app)
      .post(ROUTE)
      .auth(token, { type: 'bearer' })
      .send({
        firstName: 'first',
        lastName: 'last',
        emailAddress,
      });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      error: 'UnableToCreateMember',
      additionalInfo: {},
    });
  });

  it('should create member if email exists for another organization', async () => {
    const emailAddress = 'myemail@org.com';
    await prisma.member.create({
      data: {
        firstName: 'first',
        lastName: 'last',
        orgId: otherOrganization.id,
        emailAddress,
      },
    });

    const res = await supertest(app)
      .post(ROUTE)
      .auth(token, { type: 'bearer' })
      .send({
        firstName: 'first',
        lastName: 'last',
        emailAddress,
      });

    expect(res.status).toBe(201);
    expect(await prisma.member.count()).toBe(2);
  });
});
