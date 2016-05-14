var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: '../public',
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
