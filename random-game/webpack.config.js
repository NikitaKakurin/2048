const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const filename  = ext => `[name][contenthash].${ext}`;

const cssLoaders = extra =>{
  let loaders = [{
      loader:MiniCssExtractPlugin.loader,
  },
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [postcssPresetEnv({ browsers: 'last 2 versions' })
          ],
        ],
      }
    }
  }];
  if(extra){
      loaders.push(extra)
  }
  return loaders
}

module.exports = {
    context: path.resolve(__dirname,'./src'),
    mode:'development',
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    plugins:[
        new HTMLWebpackPlugin({
            template:'./index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: filename("css")
        }),
        new CopyWebpackPlugin({
          patterns: [
            { from: path.resolve(__dirname,"src/favicon.svg"), to: path.resolve(__dirname,"dist") },
          ],
        }),
    ],
    module: {
        rules: [
          {
            test: /\.less$/i,
            use: cssLoaders("less-loader")
          },
          {
            test: /\.s[ac]ss$/i,
            use: cssLoaders("sass-loader")
          },
          {
            test: /\.css$/i,
            use: cssLoaders(),
          },
          {
            test:/\.(png|jpg|svg|gif)$/,
            type: "asset/resource"
          },
          {
            test:/\.(mp3|wav)$/,
            type: "asset/resource"
          },
          {
            test:/\.(ttf|woff|woff2|eot)$/,
            type: 'asset/resource'
          },
        ],
      },
}