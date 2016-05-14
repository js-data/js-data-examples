var webpack = require('webpack')

module.exports = {
  entry: './src/index',
  output: {
    path: '../public',
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.ts/,
        loaders: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  }
}
