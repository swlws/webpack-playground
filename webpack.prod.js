const baseConfig = require('./webpack.base');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'production',
    devServer: {
      static: './dist',
    },
  });
};
