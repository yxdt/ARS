// babel.config.js
const apis = require("@tarojs/taro-h5/dist/taroApis");
module.exports = {
  presets: [
    [
      "@babel/env",
      {
        spec: true,
        useBuiltIns: false,
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
};
