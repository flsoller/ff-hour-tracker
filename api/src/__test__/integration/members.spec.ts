import app from '../../app';
import supertest from 'supertest';
import { prisma } from '../../utils/prisma';
import { createOrganizations } from '../helpers/helpers';
import { Organization } from '@prisma/client';

describe('createMember', () => {
  const ROUTE = '/api/v0/members';
  let organization: Organization;
  let otherOrganization: Organization;

  beforeEach(async () => {
    [organization, otherOrganization] = await createOrganizations();
  });

  it('should create one member', async () => {
    const res = await supertest(app).post(ROUTE).send({
      firstName: 'Arthur',
      lastName: 'Morgan',
      emailAddress: 'arthur@coolguy.com',
      organizationId: organization.id,
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchSnapshot({
      id: expect.any(String),
    });
    expect(await prisma.member.count()).toBe(1);
  });

  it('should fail when required fields are missing', async () => {
    const res = await supertest(app).post(ROUTE).send({
      firstName: 'Arthur',
      lastName: 'Morgan',
      emailAddress: 'arthur@coolguy.com',
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      error: 'MissingInformation',
      additionalInfo: {},
    });
  });

  it('should fail when organization does not exist', async () => {
    const res = await supertest(app).post(ROUTE).send({
      firstName: 'Some',
      lastName: 'One',
      emailAddress: 'someone@company.com',
      organizationId: 'afd195f1-cf17-480c-97aa-ee884fa00d24',
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      error: 'OrganizationDoesNotExist',
      additionalInfo: {},
    });
  });

  it('should not create member when email not unique for organization', async () => {
    await prisma.member.create({
      data: {
        firstName: 'first',
        lastName: 'last',
        orgId: organization.id,
        emailAddress: 'myemail@org.com',
      },
    });

    const res = await supertest(app).post(ROUTE).send({
      firstName: 'first',
      lastName: 'last',
      emailAddress: 'myemail@org.com',
      organizationId: organization.id,
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
        orgId: organization.id,
        emailAddress,
      },
    });

    const res = await supertest(app).post(ROUTE).send({
      firstName: 'first',
      lastName: 'last',
      emailAddress,
      organizationId: otherOrganization.id,
    });

    expect(res.status).toBe(201);
    expect(await prisma.member.count()).toBe(2);
  });
});
