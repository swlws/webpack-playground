import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import toml from 'toml';
import yaml from 'yamljs';
import json5 from 'json5';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (env) => {
  console.log(`webpack env:`);
  console.log(JSON.stringify(env, null, 2));
  console.log('================\n');

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
    devtool: 'inline-source-map',
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
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webpack playground',
      }),
      // new BundleAnalyzerPlugin(),
    ],
    devServer: {
      static: './dist',
    },
    optimization: {
      runtimeChunk: 'single',
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
    },
  };
};
