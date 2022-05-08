/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  clearMocks: true,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/__test__/helpers/globalSetup.ts',
  setupFilesAfterEnv: ['<rootDir>/src/__test__/helpers/setup.ts'],
};
