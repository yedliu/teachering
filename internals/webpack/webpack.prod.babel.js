const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const cheerio = require('cheerio');
const fs = require('fs');
const config = require('./config');
const enteringPath = process.env.ENV_TARGET;
const faviconPath = `${config[enteringPath].output.publicPath}favicon.ico`;
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const isTest = process.env.ENV_TYPE === 'test';

let webpackConfig = require('./webpack.base.babel')({
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    path.join(process.cwd(), config[enteringPath].entrance),
  ],
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
            drop_console: isTest ? false : true,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      chunks: 'all',
      minSize: 50000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        main: {
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: (isTest ? [] : [new SWPrecacheWebpackPlugin(config[enteringPath].plugins.sw)])
    .concat([
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      // Minify and optimize the index.html
      new HtmlWebpackPlugin({
        templateContent: templateContent(),
        favicon: './app/favicon.ico',
        faviconPath,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: true,
      }),
      new webpack.SourceMapDevToolPlugin({
        include: 'app/**/*.js',
        filename: '/sourceMap/[name][hash:8].map',
      })
    ]),
  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
    maxAssetSize: 300000,
    maxEntrypointSize: 600000,
  },
});

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

function templateContent() {
  const html = fs.readFileSync(
    path.resolve(process.cwd(), 'app/index.html')
  ).toString();

  const doc = cheerio(html);
  const head = doc.find('head');
  head.append(`<script src="${config[enteringPath].output.publicPath}static/ueditor/ueditor.config.js"></script>`);
  head.append(`<script src="${config[enteringPath].output.publicPath}static/ueditor/ueditor.all.min.js"></script>`);
  head.append(`<script src="${config[enteringPath].output.publicPath}static/ueditor/lang/zh-cn/zh-cn.js"></script>`);
  // head.append('<script type="text/javascript" src="//acc.zmlearn.com/index.js" crossorigin="" defer=""></script>');
  head.append('<script src="https://statics-lib.zmlearn.com/zm-qb-encrypt/1.0.0/_-_.2018-09-01.js"></script>');
  head.append('<script src="https://statics-lib.zmlearn.com/zm-qb-encrypt/1.0.0/-_-.2018-09-01.js"></script>');
  return doc.toString();
}

module.exports = webpackConfig;
