const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const path = require('path');

module.exports = {
    entry: 'src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {         
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      hmr: process.env.NODE_ENV === 'development',
                    },
                  },
                  'css-loader',
                  'sass-loader',
                ],
              },            
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,                
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]',
                    publicPath: '/',
                }
            },
            {
                test: /\.json$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                }
            }, 
            {
                test: /\.json$/,
                use: ['json-loader'],
                type: 'javascript/auto'
            },
            {
                test: /\.(woff2?|woff|ijmap|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                  limit: 10000,
                }
            },                 
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        historyApiFallback:true,
    },
    plugins: [
        new HtmlWebPackPlugin({
            favicon: 'src/assets/images/favicon.ico',
            template: "src/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            // filename: "[name].css",
            // chunkFilename: "[id].css"
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx','.scss'],
        alias: {
            src: path.resolve(__dirname, './src')
        }
    }
};