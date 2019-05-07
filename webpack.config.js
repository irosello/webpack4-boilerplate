const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')


module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: '[name].bundle.js',
    //publicPath: ""
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin()]
  },
  module: {
    rules: [
      //pug
      {
        test: /\.pug$/,
        use: [
          {loader: 'html-loader', options: {attrs:false}}, 
          {loader: 'pug-html-loader', options: {pretty:true}}
        ]
      },
      //babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      //style and css extract
      {
        test: [/.css$|.scss$/],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader", {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('autoprefixer')({
              'browsers': ['> 1%', 'last 2 versions']
            })],
          }
        }]
      },
      //image file loader
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/images/",
              publicPath: '../assets/images/'
            }
          }
        ]
      },
      //fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/fonts/',
            publicPath: '../assets/fonts'
          }
        }]
      }
    ]
  },
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss'),
      //'@images': path.resolve(__dirname, 'src/assets/images'),
      '@': path.resolve(__dirname, 'src')
    },
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "scss/[name].css",
    }),
    new HtmlWebpackPlugin({
      title: "Setting up webpack 4 with Pug",
      filename: 'app/modules/providers/index.html',
      template: "src/app/modules/providers/index.pug",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'], directory: true }
    })
  ],
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000
  }
};
