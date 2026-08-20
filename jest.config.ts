const jestConfig = {
  transform: {
    "^.+\\.(ts|tsx)$": ["@swc/jest"],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default jestConfig;
