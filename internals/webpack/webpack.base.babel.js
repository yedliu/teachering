/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
const config = require('./config');
const enteringPath = process.env.ENV_TARGET;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const buildTime = new Date();
const buildVersion = `${buildTime.getFullYear()}-${buildTime.getMonth() + 1}-${buildTime.getDate()} ${buildTime.getHours()}:${buildTime.getMinutes()}`;

module.exports = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), `dist${config[enteringPath].output.publicPath}`),
  }, config[enteringPath].output, options.output), // Merge with env dependent settings
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  optimization: options.optimization,
  module: {
    rules: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      exclude: /node_modules/,
      include: [path.resolve('app')],
      use: ['happypack/loader?id=babel'],
    },
    {
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      exclude: [path.resolve('node_modules/antd')],
      use: ['happypack/loader?id=css-loader'],
    },
    {
      test: /\.css$/,
      include: [path.resolve('node_modules/antd')],
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.(eot|ttf|woff|woff2|otf)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: devMode ? 'fonts/[name].[ext]' : '[sha256:hash:10].[ext]',
        },
      }],
    }, {
      test: /\.svg$/,
      use: ['happypack/loader?id=svg-url-loader'],
    }, {
      test: /\.(jpg|png|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1000,
        }
      }
    }, {
      test: /\.html$/,
      use: 'html-loader',
    }, {
      test: /\.json$/,
      type: 'javascript/auto',
      use: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    }
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),
    new HappyPack({
      id: 'babel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
        options: options.babelQuery,
      }],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      threads: 8
    }),
    new HappyPack({
      id: 'css-loader',
      loaders: ['style-loader', 'css-loader'],
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      threads: 8
    }),
    new HappyPack({
      id: 'svg-url-loader',
      loaders: [{
        loader: 'svg-url-loader',
        options: {
          // Inline files smaller than 10 kB
          limit: 10 * 1024,
          noquotes: true,
        },
      }],
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      threads: 8
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ENV_TYPE: JSON.stringify(process.env.ENV_TYPE),
        ENV_TARGET: JSON.stringify(process.env.ENV_TARGET),
        buildVersion: JSON.stringify(buildVersion),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // new webpack.ProvidePlugin({ SVGA: "svgaplayerweb"}),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[chunkhash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[chunkhash].css',
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../../static'), to: path.resolve(__dirname, `../../dist${config[enteringPath].output.publicPath}/static`) }
    ])
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
