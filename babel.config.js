module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['ie >= 7'],
        },
        modules: 'commonjs',
        loose: true,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    // 'styled-components',
    // '@babel/plugin-transform-runtime',
    [
      'import',
      {
        libraryName: 'antd',
        style: 'css',
      },
      'antd'
    ],
    ['import', {
      'libraryName': 'zm-tk-ace',
      'libraryDirectory': 'es',
      'camel2DashComponentName': false
    }, 'zm-tk-ace'],
    'transform-es2015-modules-commonjs',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-strict-mode',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-styled-components',
  ],
  env: {
    production: {
      plugins: [
        'lodash',
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-inline-elements',
        '@babel/plugin-transform-react-constant-elements',
      ],
    },
    test: {
      plugins: ['dynamic-import-node'],
    },
  },
};
