import app from '../../app';
import supertest from 'supertest';
import { prisma } from '../../utils/prisma';
import {
  createUserForOrganization,
  createOrganizations,
  loginTestUser,
} from '../helpers/helpers';
import { compareSync } from 'bcryptjs';
import { User } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';

describe('authController', () => {
  const ROUTE = '/api/v0/auth';
  let orgId: string;
  let token: string;
  let testUser: User;

  beforeEach(async () => {
    const [organization] = await createOrganizations();
    testUser = await createUserForOrganization(organization.id);
    token = await loginTestUser(app, testUser.emailAddress);
    orgId = organization.id;
  });

  describe('register', () => {
    it('should register a new user and hash the password', async () => {
      const res = await supertest(app).post(`${ROUTE}/register`).send({
        emailAddress: 'some@user.com',
        password: 'pwd',
        name: 'User Name',
        orgId,
      });

      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual({
        emailAddress: 'some@user.com',
      });

      const createdUser = await prisma.user.findFirst({
        where: {
          emailAddress: 'some@user.com',
        },
      });

      expect(compareSync('pwd', createdUser?.password || '')).toBe(true);
    });

    it('should not be able to register a user when email is taken', async () => {
      const existingUser = await prisma.user.create({
        data: {
          emailAddress: 'taken@user.com',
          orgId,
          password: '123',
        },
      });

      const res = await supertest(app).post(`${ROUTE}/register`).send({
        emailAddress: existingUser.emailAddress,
        password: 'pwd',
        name: 'User Name',
        orgId,
      });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'UnableToCreateResource',
        additionalInfo: {},
      });
    });
  });

  describe('userSignIn', () => {
    it('should return valid access token and set cookie with refresh token', async () => {
      const res = await supertest(app).post(`${ROUTE}/signin`).send({
        emailAddress: testUser.emailAddress,
        password: '12345',
      });

      expect(res.status).toBe(200);
      expect(verify(res.body.accessToken, 'ACCESS_VAR_HERE')).toBeTruthy();

      const cookieValues: string[] = res.headers['set-cookie'][0]
        .split('=')
        .map((item: string) => item.split(';')[0]);

      expect(cookieValues[0]).toBe('rtc');
      expect(verify(cookieValues[1], 'REFRESH_VAR_HERE')).toBeTruthy();
    });

    it('should throw an error if user does not exist', async () => {
      const res = await supertest(app).post(`${ROUTE}/signin`).send({
        emailAddress: 'idontexist',
        password: '12345',
      });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'InvalidInformation',
        additionalInfo: {},
      });
    });

    it('should throw an error if user password is incorrect', async () => {
      const res = await supertest(app).post(`${ROUTE}/signin`).send({
        emailAddress: testUser.emailAddress,
        password: 'wrong',
      });

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'InvalidInformation',
        additionalInfo: {},
      });
    });
  });

  describe('refreshToken', () => {
    it('should return valid access token if valid refresh token cookie is provided', async () => {
      const validRefreshToken = sign(
        { userId: testUser.id },
        'REFRESH_VAR_HERE',
      );

      const res = await supertest(app)
        .get(`${ROUTE}/refresh-token`)
        .set('Cookie', `rtc=${validRefreshToken}`);

      expect(res.status).toBe(200);
      expect(verify(res.body.accessToken, 'ACCESS_VAR_HERE')).toBeTruthy();
    });

    it('should fail when refresh token is invalid', async () => {
      const invalidRefreshToken = sign(
        { userId: testUser.id },
        'something-else',
      );

      const res = await supertest(app)
        .get(`${ROUTE}/refresh-token`)
        .set('Cookie', `rtc=${invalidRefreshToken}`);

      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({
        error: 'InvalidInformation',
        additionalInfo: {},
      });
    });

    it('should fail when refresh token is missing / key is incorrect', async () => {
      const validRefreshToken = sign(
        { userId: testUser.id },
        'REFRESH_VAR_HERE',
      );

      const res = await supertest(app)
        .get(`${ROUTE}/refresh-token`)
        .set('Cookie', `blah=${validRefreshToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual({
        error: 'MissingInformation',
        additionalInfo: {},
      });
    });

    it('should fail when user in a valid refresh token does not exist', async () => {
      const validRefreshToken = sign(
        { userId: 'i-dont-exist' },
        'REFRESH_VAR_HERE',
      );

      const res = await supertest(app)
        .get(`${ROUTE}/refresh-token`)
        .set('Cookie', `rtc=${validRefreshToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toStrictEqual({
        error: 'ResourceNotFound',
        additionalInfo: {},
      });
    });
  });

  describe('protectedRoutes', () => {
    it('should throw an error if auth header is malformed', async () => {
      const res = await supertest(app)
        .post('/api/v0/organizations')
        .set({ Authorization: 'NoBearer ' + token })
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

    it('should throw an error if token is missing', async () => {
      const res = await supertest(app)
        .post('/api/v0/organizations')
        .set({ Authorization: 'Bearer ' })
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
});
