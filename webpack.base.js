const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');

module.exports = (env) => {
  // console.log(`webpack env:`);
  // console.log(JSON.stringify(env, null, 2));
  // console.log('================\n');

  return {
    mode: 'development',
    // entry: './src/index.js',
    entry: {
      index: './src/index.js',
      // main: './src/main.js',
    },
    output: {
      // filename: 'bundle.js',
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: './',
    },
    module: {
      rules: [
        // css
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        // 图片
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        // 字体
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        // 数据
        {
          test: /\.(csv|tsv)$/i,
          use: ['csv-loader'],
        },
        {
          test: /\.xml$/i,
          use: ['xml-loader'],
        },
        // 配置文件
        {
          test: /\.toml$/i,
          type: 'json',
          parser: {
            parse: toml.parse,
          },
        },
        {
          test: /\.yaml$/i,
          type: 'json',
          parser: {
            parse: yaml.parse,
          },
        },
        {
          test: /\.json5$/i,
          type: 'json',
          parser: {
            parse: json5.parse,
          },
        },
        // babel-loader
        // {
        //   test: /\.js$/,
        //   include: path.resolve(__dirname, 'src'),
        //   loader: 'babel-loader',
        // },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webpack playground',
      }),
      // new BundleAnalyzerPlugin(),
    ],
    optimization: {
      runtimeChunk: 'single',
      // https://webpack.docschina.org/guides/build-performance/#minimal-entry-chunk
      // runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      usedExports: true,
    },
  };
};
