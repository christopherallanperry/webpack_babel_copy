const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/bundle.js"
  },
  devServer: {
    contentBase: "./public"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        {
          from: "index.html",
          to: "",
          toType: "file",
          context: "./src",
        }
      ],
      { copyUnmodified: true }
    )
  ]
};