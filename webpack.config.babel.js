import path from 'path';

module.exports = {
  context: __dirname,
  entry: {
    bundle: './index.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].umd.js',
    library: 'coreLessTransportHttp',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', {
              modules: false,
              targets: {
                // TODO apply this only if environment is browser
                browsers: [
                  'last 2 versions'
                ],
                // TODO apply this only if environment is node (processed by webpack)
                node: 6.9
              }
            }]
          ],
          babelrc: false
        }
      }
    ]
  },
  resolve: {
    alias: {
      request$: 'xhr'
    }
  },
  externals: {
    '@consoless/core': {
      commonjs: '@consoless/core',
      amd: '@consoless/core',
      root: 'coreLess'
    }
  }
};
