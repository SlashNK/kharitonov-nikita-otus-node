import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // Automatically clear mock calls, instances, contexts, and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],

  // Transform options to support TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // A map from regular expressions to paths to transformers
  transformIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],

  // Specifies the module file extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],

  // The number of seconds after which a test is considered as slow and reported as such in the results
  slowTestThreshold: 5,

  // An array of paths to snapshot serializer modules Jest should use for snapshot testing
  snapshotSerializers: [],

  // The test environment options
  testEnvironmentOptions: {},

  // Adds a location field to test results
  testLocationInResults: false,

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  watchPathIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],

  // Whether to use watchman for file crawling
  watchman: true,
};

export default config;
