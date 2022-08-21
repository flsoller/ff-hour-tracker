import app from '../../app';
import supertest from 'supertest';
import { prisma } from '../../utils/prisma';
import {
  createOrganizations,
  createMemberForOrganization,
  createUserForOrganization,
  loginTestUser,
} from '../helpers/helpers';
import { Organization } from '@prisma/client';

describe('activities controller', () => {
  const ROUTE = '/api/v0/timelog';
  let organization: Organization;
  let otherOrganization: Organization;
  let token: string;

  beforeEach(async () => {
    [organization, otherOrganization] = await createOrganizations();
    const testUser = await createUserForOrganization(organization.id);
    token = await loginTestUser(app, testUser.emailAddress);
  });

  describe('createTimeLogForDate', () => {
    it('should create a timelog entry for a member', async () => {
      const member = await createMemberForOrganization(
        organization.id,
        'brian@nice-car.com',
        'Brian',
        `O'Connor`,
      );

      const activity = await prisma.activityType.create({
        data: {
          activityName: 'Test Activity',
          activityDesc: 'Detailed description',
          orgId: organization.id,
        },
      });

      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          date: new Date(2022, 5, 22),
          hours: 2,
          activityTypeId: activity.id,
          memberId: member.id,
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchSnapshot();
    });

    it('should throw member not found error if member does not exist for organization', async () => {
      const member = await createMemberForOrganization(otherOrganization.id);

      const activity = await prisma.activityType.create({
        data: {
          activityName: 'Test Activity',
          activityDesc: 'Detailed description',
          orgId: organization.id,
        },
      });

      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          date: new Date(2022, 5, 22),
          hours: 2,
          activityTypeId: activity.id,
          memberId: member.id,
        });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'MemberNotFound',
        additionalInfo: {},
      });
    });

    it('should throw activity not found error if it does not exist for organization', async () => {
      const member = await createMemberForOrganization(organization.id);

      const activity = await prisma.activityType.create({
        data: {
          activityName: 'Test Activity',
          activityDesc: 'Detailed description',
          orgId: otherOrganization.id,
        },
      });

      const res = await supertest(app)
        .post(ROUTE)
        .auth(token, { type: 'bearer' })
        .send({
          date: new Date(2022, 5, 22),
          hours: 2,
          activityTypeId: activity.id,
          memberId: member.id,
        });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'ActivityNotFound',
        additionalInfo: {},
      });
    });
  });
});
