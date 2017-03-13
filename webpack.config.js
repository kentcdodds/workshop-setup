const join = require('path').join

const include = join(__dirname, 'src')

module.exports = {
  entry: './src/index',
  output: {
    path: join(__dirname, 'dist/bundled'),
    libraryTarget: 'commonjs2',
    filename: 'index.js',
  },
  devtool: 'source-map',
  externals: {
    process: 'process',
    child_process: 'child_process', // eslint-disable-line camelcase
  },
  module: {
    rules: [{test: /\.js$/, use: [{loader: 'babel-loader'}], include}],
  },
}
