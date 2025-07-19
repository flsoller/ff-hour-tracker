import { faker } from "@faker-js/faker";

function createOrganization() {
  return {
    name: faker.company.name(),
    description: faker.company.buzzPhrase(),
  };
}

function createUser(orgId: string) {
  return {
    emailAddress: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    orgId,
  };
}

function createMember() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
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

export { createMembers, createOrganization, createUser };
