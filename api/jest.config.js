/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/__test__/setup.ts'],
};
