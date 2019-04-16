const join = require('path').join
const webpack = require('webpack')

const include = join(__dirname, 'src')

module.exports = {
  entry: './src/index',
  target: 'node',
  mode: 'development',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: 'index.js',
  },
  devtool: 'source-map',
  module: {
    rules: [{test: /\.js$/, use: [{loader: 'babel-loader'}], include}],
  },
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
}

/* eslint babel/camelcase:0 */
