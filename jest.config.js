module.exports = {
  //testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'es5',
        removeComments: false,
        preserveConstEnums: true,
        moduleResolution: 'node',
        experimentalDecorators: true,
        noImplicitAny: false,
        allowSyntheticDefaultImports: true,
        strictNullChecks: true,
        noImplicitThis: true,
        sourceMap: true,
      },
      diagnostics: false,
    },
  },
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/test/**/*.test.js', '<rootDir>/test/**/test.js', '<rootDir>/src/controllers/**/*.test.js', '<rootDir>/src/controllers/**/test.js'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    react: 'nervjs',
    'react-addons-test-utils': 'nerv-test-utils',
    'react-dom': 'nervjs',
    weui: '<rootDir>/test/__mock__/styleMock.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/test/__mock__/styleMock.js',
  },
};
