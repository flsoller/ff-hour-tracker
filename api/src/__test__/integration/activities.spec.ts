import app from '../../app';
import supertest from 'supertest';
import { prisma } from '../../utils/prisma';
import {
  createOrganizations,
  createUserForOrganization,
  loginTestUser,
} from '../helpers/helpers';
import { Organization } from '@prisma/client';

describe('activities controller', () => {
  const ROUTE = '/api/v0/activities';
  let organization: Organization;
  let otherOrganization: Organization;
  let token: string;

  beforeEach(async () => {
    [organization, otherOrganization] = await createOrganizations();
    const testUser = await createUserForOrganization(organization.id);
    token = await loginTestUser(app, testUser.emailAddress);
  });

  describe('createActivity', () => {
    it('should create an activity for an organization', async () => {
      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          activityName: 'Test Activity',
          activityDesc: 'This is a nice activity',
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchSnapshot({
        id: expect.any(String),
      });
      expect(await prisma.activityType.count()).toBe(1);
    });

    it('should fail when required fields are missing', async () => {
      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          activityDesc: 'This is a nice activity',
        });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'MissingInformation',
        additionalInfo: {},
      });
    });

    it('should not create activity type when name not unique for organization', async () => {
      const activityName = 'Test Activity';
      await prisma.activityType.create({
        data: {
          activityDesc: 'This is a nice activity',
          activityName,
          orgId: organization.id,
        },
      });

      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          activityDesc: 'This is a nice activity',
          activityName,
        });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'UnableToCreateResource',
        additionalInfo: {},
      });
    });

    it('should create activity if name already exists for other organization', async () => {
      const activityName = 'Test Activity';
      await prisma.activityType.create({
        data: {
          activityDesc: 'This is a nice activity',
          activityName,
          orgId: otherOrganization.id,
        },
      });

      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          activityDesc: 'This is a nice activity',
          activityName,
        });

      expect(res.status).toBe(201);
      expect(await prisma.activityType.count()).toBe(2);
    });
  });

  describe('getAllActivities', () => {
    it('should return all activities for an organization', async () => {
      await prisma.activityType.create({
        data: {
          activityDesc: 'This is a nice activity',
          activityName: 'Some Activity',
          orgId: organization.id,
        },
      });

      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual([
        {
          id: expect.any(String),
          activityName: 'Some Activity',
          activityDesc: 'This is a nice activity',
          orgId: organization.id,
        },
      ]);
    });

    it('should not return activities for another organization', async () => {
      await prisma.activityType.create({
        data: {
          activityDesc: 'This is a nice activity',
          activityName: 'Some Activity',
          orgId: otherOrganization.id,
        },
      });

      const res = await supertest(app)
        .get(ROUTE)
        .auth(token, { type: 'bearer' });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual([]);
    });
  });
});
