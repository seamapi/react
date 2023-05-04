/** @type {() => Promise<import('ts-jest').JestConfigWithTsJest>} */
module.exports = async () => {
  return {
    // Any empty globals are set in global-setup.cjs.
    globals: {
      JEST_SEAM_ENDPOINT: '',
      JEST_SEAM_PUBLISHABLE_KEY_1: '',
      JEST_SEAM_PUBLISHABLE_KEY_2: '',
      JEST_SEAM_CLIENT_SESSION_TOKEN_2: '',
    },
    globalSetup: '<rootDir>/test/jest/global-setup.cjs',
    globalTeardown: '<rootDir>/test/jest/global-teardown.cjs',
    setupFilesAfterEnv: ['<rootDir>/test/jest/setup-api.ts'],
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
      '^fixtures/(.*).js$': '<rootDir>/test/fixtures/$1',
      '^lib/(.*).js$': '<rootDir>/src/lib/$1',
      '^@seamapi/react': '<rootDir>/src',
    },
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          useESM: true,
          tsconfig: 'tsconfig.test.json',
        },
      ],
    },
  }
}
