export default async () => ({
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/__mocks__/**',
    '!src/test-utils/**',
  ],
  coverageDirectory: 'coverage',
  // moduleNameMapper: {
  //   '^axios-curlirize/src/lib/CurlHelper$':
  //     '<rootDir>/src/__mocks__/axios-curlirize.js',
  //   '^chalk$': '<rootDir>/src/__mocks__/chalk.js',
  // },
});
