const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: __dirname + "/src/main.jsx",
  devtool: "eval-source-map",
  output: {
    filename: "app.js",
    path: __dirname + "/public"
  },

  plugins: [
    new webpack.SourceMapDevToolPlugin({
    })
  ],

  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}
