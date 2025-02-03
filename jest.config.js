const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleNameMapper,
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
