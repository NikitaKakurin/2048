const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin")
let mode='development';
if(process.env.Node_ENV === 'production'){
    mode='production';
}
console.log(mode + ' mode');
const filename  = ext =>(mode==='production')? `[name][contenthash].${ext}`:`[name].${ext}`;

const optimization = function(){
  const config = {
    splitChunks: {
        chunks: 'all'
    },
    minimize: false,
    minimizer: [],
  }
  
  if(mode==='production'){
    config.minimize = true;
    config.minimizer = [  
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ];
  }
  return config;
}

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
          [postcssPresetEnv({ browsers: '>0.2%, last 2 versions, not dead' })
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
    optimization: optimization(),
    devServer: {
      static: {
        directory: path.resolve(__dirname, './src'),
        watch:true,
      },
      compress: true,
      port: 'auto',
      hot:true,
      open:true,
    },
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: "assets/[hash][ext][query]",
    },
    devtool: 'source-map',
    plugins:[
        // new CssMinimizerPlugin(),
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
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
        ],
      },
}