export default {
  testEnvironment: "node",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  coverageReporters: ["text-summary"],
  collectCoverageFrom: ["<rootDir>/**/*.js","!<rootDir>/tree.js" ],
  testMatch: ["<rootDir>/test/**/*.test.js"],
  transform: {},
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
