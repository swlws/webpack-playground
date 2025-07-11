const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LifecyclePlugin = require('./webpack/plugins/lifecycle-plugin/index.js');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');

module.exports = (env) => {
  // console.log(`webpack env:`);
  // console.log(JSON.stringify(env, null, 2));
  // console.log('================\n');

  console.log('Webpack Env:', env);
  console.log();

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
      assetModuleFilename: 'images/[name][ext][query]', // 资源文件输出目录
    },
    module: {
      rules: [
        // css
        {
          test: /\.css$/i,
          use: [
            env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
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
        // text 文件
        {
          test: /\.txt$/i,
          type: 'asset/source',
        },
        // babel-loader
        {
          test: /\.(js|jsx)$/, // 如果支持 jsx
          exclude: /node_modules|build.js/,
          use: [
            // 自定义的日志 loader
            {
              loader: 'babel-loader',
            },
          ],
        },
        // md-loader
        {
          test: /\.md$/,
          exclude: /node_modules/,
          use: [
            {
              loader: path.resolve(__dirname, 'webpack/loaders/md-loader.js'),
              options: {
                // 可以传递 marked 的配置选项
                breaks: true, // 转换换行符为 <br>
                // 自定义高亮函数
                highlight: (code, lang) => {
                  // 这里可以使用 highlight.js 或其他高亮库
                  return require('highlight.js').highlightAuto(code).value;
                },
              },
            },
          ],
        },
        {
          test: /build.js$/, // 匹配 jQuery 的路径
          use: [
            {
              loader: 'val-loader',
              options: {
                date: new Date().toLocaleString(), // 传递当前日期作为参数
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // 字符串
      new webpack.BannerPlugin({
        banner: 'this is a banner by webpack.',
      }),

      new HtmlWebpackPlugin({
        template: './public/index.html', // 你的模板 HTML 路径
        title: 'webpack playground',
        inject: 'body', // 或直接删掉，让它默认插入到 <body>
        meta: {
          viewport:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
        custom_key: 'this is a custom value',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist'),
            globOptions: {
              ignore: ['**/index.html'], // ⚠️ 忽略 index.html，因为 HtmlWebpackPlugin 会单独处理
            },
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      // 自定义生命周期插件
      new LifecyclePlugin(),
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
