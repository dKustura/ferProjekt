var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './assets/javascript/application.js',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },

  resolve: {
    root: [
      path.join(__dirname, 'assets/javascript/')
    ],
    modulesDirectories: [
      'node_modules'
    ]
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-2']
      }
    }, {
      test: /\.scss|\.css$/,
      loader: ExtractTextPlugin.extract('css!sass')
    }]
  },

  devtool: '#inline-source-map',

  sassLoader: {
    includePaths: [path.resolve(__dirname, 'assets/stylesheet')]
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
