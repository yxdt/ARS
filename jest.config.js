module.exports = {
  testEnvironment: "node",
  verbose: true,
  moduleFileExtensions: ["js", "jsx", "json"],
  rootDir: __dirname,
  testMatch: [
    "<rootDir>/src/controllers/**/*.test.js",
    "<rootDir>/src/controllers/**/test.js",
  ],
  transform: {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\\.js?$": "babel-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    react: "nervjs",
    "react-addons-test-utils": "nerv-test-utils",
    "react-dom": "nervjs",
    //weui: "<rootDir>/__mock__/styleMock.js",
    //"\\.(css|less|sass|scss)$": "<rootDir>/__mock__/styleMock.js",
  },
};
