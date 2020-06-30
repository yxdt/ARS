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
  ],

  transform: {
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.js?$": "babel-jest",
    //"^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
    //"^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    react: "nervjs",
    "react-addons-test-utils": "nerv-test-utils",
    "react-dom": "nervjs",
    weui: "<rootDir>/test/__mock__/styleMock.js",
    "\\.(css|less|sass|scss)$": "<rootDir>/test/__mock__/styleMock.js",
  },
};
