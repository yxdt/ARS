module.exports = {
  //testEnvironment: 'node',
  verbose: true,

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  rootDir: __dirname,
  testMatch: [
    "<rootDir>/test/**/*.test.js",
    "<rootDir>/test/**/test.js",
    "<rootDir>/src/controllers/**/*.test.js",
    "<rootDir>/src/controllers/**/test.js",
    "<rootDir>/wetest/**/*.test.js",
  ],

  transform: {
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.js?$": "babel-jest",
    //"^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
    //"^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
