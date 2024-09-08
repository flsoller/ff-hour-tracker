import { faker } from '@faker-js/faker';

function createOrganization() {
  return {
    name: faker.company.name(),
    description: faker.company.bs(),
  };
}

function createUser(orgId: string) {
  return {
    emailAddress: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.name.fullName(),
    orgId,
  };
}

function createMember() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    emailAddress: faker.internet.email(),
  };
}

function createMembers(amountToCreate = 0) {
  const members: {
    firstName: string;
    lastName: string;
    emailAddress: string;
  }[] = [];

  for (let i = 0; i < amountToCreate; i++) {
    members.push({ ...createMember() });
  }

  return members;
}

export { createOrganization, createUser, createMembers };
