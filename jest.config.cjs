const { env } = require('node:process')

env.SEAM_PUBLISHABLE_KEY = 'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98'

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^fixtures/(.*).js$': '<rootDir>/test/fixtures/$1',
    '^lib/(.*).js$': '<rootDir>/src/lib/$1',
    '^index.js$': '<rootDir>/src/lib'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json'
      }
    ]
  }
}
