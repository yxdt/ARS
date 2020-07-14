const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      (compiler) => {
        new TerserPlugin().apply(compiler);
      },
    ],
  },
};
