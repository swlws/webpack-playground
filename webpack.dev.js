const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
      // 全局模块，不再需要 import 引入
      new webpack.ProvidePlugin({
        _: 'lodash',
      }),
    ],
    devServer: {
      static: './dist',
      hot: true,
    },
  });
};
