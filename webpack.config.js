'use strict';

var webpack = require('webpack');
var path = require('path');
var debug = true;

module.exports = {
    context: path.join(__dirname, 'frontend'),
    entry: './js/index.js',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-class-properties', 'transform-decorators-legacy'],
                }
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!stylus-loader'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }],
            },
        ]
    },
    resolve: {
        modules: [
            `${__dirname}/frontend/js`,
            'node_modules',
        ],
        extensions: ['.js', '.jsx', '.styl'],
    },
    resolveLoader: {
        modules: [`${__dirname}/node_modules`, 'node_modules']
    },
    output: {
        path: __dirname + "/dist/",
        filename: "bundle.min.js"
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: true,
        //     sourceMap: false,
        //     compress: {
        //         warnings: false, // Suppress uglification warnings
        //         pure_getters: true,
        //         screw_ie8: true
        //     },
        //     output: {
        //         comments: false,
        //     },
        //     exclude: [/\.min\.js$/gi] // skip pre-minified libs
        // }),
    ],
};
