const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { codeInspectorPlugin } = require('code-inspector-plugin');
const baseConfig = require('./webpack.base');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  const config = merge(baseConfig(env), {
    mode: 'development',
    devtool: 'source-map',
    output: {
      // devServer 模式时，这里必须为 /  ，否则会报 Cannot GET /index.html
      publicPath: '/',
    },
    plugins: [
      // 全局模块，不再需要 import 引入
      new webpack.ProvidePlugin({
        // 如果你遇到了至少一处用到 _ 变量的模块实例，那请你将 lodash package 引入进来，并将其提供给需要用到它的模块。
        _: 'lodash',
        // 使用 ProvidePlugin 暴露出某个模块中单个导出，通过配置一个“数组路径”（例如 [module, child, ...children?]）实现此功能。
        // 所以，我们假想如下，无论 join 方法在何处调用，我们都只会获取到 lodash 中提供的 join 方法。
        join: ['lodash', 'join'],
      }),
      // 代码定位插件
      // codeInspectorPlugin({
      //   bundler: 'webpack',
      // }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      hot: true,
      open: true,
      watchFiles: ['src/**/*'],
      historyApiFallback: true,
    },
  });

  fs.writeFileSync(
    path.resolve(__dirname, '.dev.config.json'),
    JSON.stringify(config, null, 2)
  );

  return config;
};
