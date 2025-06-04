const baseConfig = require('./webpack.base');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
  });
};
