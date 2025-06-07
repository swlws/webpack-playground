const fs = require('fs');
const path = require('path');
const baseConfig = require('./webpack.base');
const { customStringify } = require('./tools/stringify');

const { merge } = require('webpack-merge');

module.exports = (env) => {
  const config = merge(baseConfig(env), {
    mode: 'production',
    output: {
      // 生产模式时，这里必须为 ./  ，否则会报 Cannot GET /index.html
      publicPath: './',
    },
  });

  fs.writeFileSync(
    path.resolve(__dirname, '.prod.config.json'),
    customStringify(config)
  );

  return config;
};
