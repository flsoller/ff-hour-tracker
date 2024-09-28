module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  clearMocks: true,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/helpers/globalSetup.ts',
  globalTeardown: '<rootDir>/test/helpers/teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/test/helpers/setup.ts'],
};
