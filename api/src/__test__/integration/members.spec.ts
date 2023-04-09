import app from '../../app';
import supertest from 'supertest';
import { prisma } from '../../utils/prisma';
import {
  createOrganizations,
  createUserForOrganization,
  loginTestUser,
} from '../helpers/helpers';
import { Organization } from '@prisma/client';

describe('members', () => {
  const ROUTE = '/api/v0/members';
  let organization: Organization;
  let otherOrganization: Organization;
  let token: string;

  beforeEach(async () => {
    [organization, otherOrganization] = await createOrganizations();
    const testUser = await createUserForOrganization(organization.id);
    token = loginTestUser(testUser.id);
  });

  describe('createMember', () => {
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

  describe('getMembersPaginated', () => {
    const emails = [
      'c@two.com',
      'b@two.com',
      't@two.com',
      'e@two.com',
      'z@two.com',
    ];
    const createMember = async (
      firstName: string,
      lastName: string,
      orgId: string,
      emailAddress: string,
    ) =>
      await prisma.member.create({
        data: {
          firstName,
          lastName,
          orgId,
          emailAddress,
        },
      });
    beforeEach(async () => {
      for (const email of emails) {
        await createMember(
          'first',
          email.split('@')[0],
          organization.id,
          email,
        );
      }
    });

    it('should return members paginated in correct format', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' });

      expect(res.status).toBe(200);
      expect(res.body.data[0]).toMatchSnapshot({ id: expect.any(String) });
      expect(res.body.data.length).toBe(5);
      expect(res.body.totalCount).toBe(5);
    });

    it('should respect limit query param', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' })
        .query({ limit: '1' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.totalCount).toBe(5);
    });

    it('should respect offset query param', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' })
        .query({ offset: '2' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);
      expect(res.body.data[0].emailAddress).toBe('e@two.com');
      expect(res.body.totalCount).toBe(5);
    });

    it('should respect order direction query param', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' })
        .query({ order: 'desc' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(5);
      expect(res.body.data[0].emailAddress).toBe('z@two.com');
      expect(res.body.totalCount).toBe(5);
    });

    it('should not return values for a user of a different org', async () => {
      const otherUser = await createUserForOrganization(otherOrganization.id);
      const otherToken = loginTestUser(otherUser.id);
      const res = await supertest(app)
        .get(ROUTE)
        .auth(otherToken, { type: 'bearer' })
        .query({ order: 'desc' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('should throw bad request error for invalid limit or offset param', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' })
        .query({ limit: 'blah', offset: 'blah' });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'InvalidQueryParams',
        additionalInfo: {},
      });
    });

    it('should throw bad request error for invalid order query param', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' })
        .query({ order: 'any' });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'InvalidQueryParams',
        additionalInfo: {},
      });
    });

    it('should throw an error for unauthorized user', async () => {
      const res = await supertest(app)
        .get(ROUTE)
        .auth('token', { type: 'bearer' });

      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({
        error: 'NotAuthorized',
        additionalInfo: {},
      });
    });
  });
});
