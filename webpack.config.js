const path = require('path')

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    watchFiles: {
      // Watch all files in the src folder and index and styles
      paths: ["src/**/*", "dist/index.html", "dist/styles.css"],
      options: {
        usePolling: true, // Enable polling
        interval: 300, // Check every 300ms
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
