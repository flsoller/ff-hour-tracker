import app from '../../app';
import supertest from 'supertest';

describe('createOrganization', () => {
  it('should create an organization', async () => {
    const res = await supertest(app).post('/api/v0/organizations').send({
      name: 'TestOrganiztion',
      description: 'I am a happy description',
    });

    expect(res.status).toBe(201);
  });

  it('should fail when required fields are missing', async () => {
    const res = await supertest(app).post('/api/v0/organizations').send({
      description: 'I am a happy description',
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      error: 'MissingInformation',
      additionalInfo: {},
    });
  });
});
