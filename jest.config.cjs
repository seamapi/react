/** @type {() => Promise<import('ts-jest').JestConfigWithTsJest>} */
module.exports = async () => {
  const getPort = await import('get-port')
  const port = await getPort.default()
  return {
    globals: {
      JEST_SEAM_ENDPOINT: `http://localhost:${port}`,
      JEST_SEAM_PUBLISHABLE_KEY_1: '', // set in global-setup.cjs
      JEST_SEAM_PUBLISHABLE_KEY_2: '', // set in global-setup.cjs
      JEST_SEAM_CLIENT_SESSION_TOKEN_2: '', // set in global-setup.cjs
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
      '^index.js$': '<rootDir>/src/lib',
      "^@seamapi/react": "<rootDir>/src/lib"
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