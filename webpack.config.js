var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var bootstrapEntryPoints = require('./webpack.bootstrap.config.js');

var isProd = process.env.NODE_ENV === 'production';
var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader?-minimize', 'sass-loader?outputStyle=uncompressed'],
    publicPath: './'
})
var cssConfig = isProd ? cssProd : cssDev;
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    entry: {
        app: './src/index.js',
        boostrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=img/[name].[ext]',
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(woff2?|svg)$/,
                use: 'url-loader?limit=10000&name=fonts/[name].[ext]'
            },
            {
                test: /\.(ttf|eot)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
                use: 'imports-loader?jQuery=jquery'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        hot: true,
        stats: 'errors-only',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Bootstrap 3 with React',
            favicon: './src/img/favicon.png',
            template: './src/index.html' // Load a custom template (lodash by default see the FAQ for details)
        }),
        new ExtractTextPlugin({
            filename: './css/[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}