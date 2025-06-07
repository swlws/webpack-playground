const baseConfig = require('./webpack.base');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'production',
    output: {
      // 生产模式时，这里必须为 ./  ，否则会报 Cannot GET /index.html
      publicPath: './',
    },
  });
};
