const baseConfig = require('./webpack.base');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      static: './dist',
    },
  });
};
