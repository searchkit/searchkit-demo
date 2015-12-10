var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool:"eval",
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js",]
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['react-hot', 'ts'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: [require.resolve("style-loader"), require.resolve("css-loader"), require.resolve("sass-loader")]
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
            'file-loader?name=[path][name].[ext]'
        ],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
