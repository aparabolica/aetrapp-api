var path = require("path");
var webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./app/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "Aetrapp"
    })
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        include: path.join(__dirname, "public"),
        exclude: /node_modules/,
        query: {
          presets: ["env", "react"]
        }
      }
    ]
  }
};
