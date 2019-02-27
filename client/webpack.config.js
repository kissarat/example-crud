module.exports = {
  mode: "development",
  // devtools: "eval-source-map",
  entry: __dirname + "/src/main.jsx",
  output: {
    path: __dirname + "/public"
  },

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
