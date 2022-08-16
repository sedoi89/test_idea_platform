const webpack = require('webpack');
const path = require("path");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');

const Dotenv = require('dotenv-webpack')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const nodeEnv = process.env.NODE_ENV || "development"
const simulateProd = process.env.SIMULATE_PROD
const isProdEnv = nodeEnv === 'production'
const isNotDevEnv = nodeEnv !== "development"

const buildPath =
const sourcePath =
const imagesPath =
const iconsPath =
const soundsPath = ;


// Common plugins
const plugins = [
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
    }),
    new MiniCssExtractPlugin(),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer(),
            ],
            context: sourcePath,
        },
    }),
    new CopyWebpackPlugin(
        {
            patterns: [
                {from: iconsPath, to: 'icons'},
                {from: imagesPath, to: 'images'}
            ]
        }
    ),
    new Dotenv({
        systemvars: true
    }),
    new HtmlWebpackPlugin({
        template: path.join(sourcePath, 'index.html'),
        path: buildPath,
        filename: 'index.html',
    }),
]


// Common rules
const rules = [
    {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
            plugins: ['react-hot-loader/babel'],
            presets: ["@babel/preset-env"]  //Preset used for env setup
        }
        // use: [
        //   'babel-loader',
        // ],
    },
    {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
            {
                // creates style nodes from JS strings
                loader: "style-loader",
                // options: {sourceMap: true}
            },
            // Translates CSS into CommonJS
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    url: false,
                    modules: {localIdentName: "[path]___[name]__[local]___[hash:base64:5]"}

                }
            },
            {
                loader:"resolve-url-loader"
            },
            {
                // compiles Sass to CSS
                loader: "sass-loader",
                options: {
                    sourceMap: true
                }
            },
        ],
    },
    {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "style-loader", 'css-loader'],
    },
    {
        test: /\.(ico|jpe?g|png|gif|svg|mp3|html)$/,
        include: [imagesPath, soundsPath],
        type: 'asset/resource',
        // use: 'file-loader',
        // generator: {
        //   filename: '[path][name].[ext]'
        // },
    },
    {
        test: /\.md$/,
        use: 'raw-loader'
    }
]


if (isProdEnv) {
    // Production plugins
    plugins.push(
        new TerserPlugin({
            // cache: true,
            parallel: true,
            // sourceMap: true
        })
    )
}
else {
    // Development plugins

}

module.exports = smp.wrap({
    mode : isNotDevEnv ? 'production' : 'development',
    target: ['web', 'es5'],
    experiments: {
        asset: true
    },
    devtool: isNotDevEnv ? false : 'source-map',
    context: sourcePath,

    entry: {
        js: ['react-hot-loader/patch','./index.js'],
    },
    output: {
        path: buildPath,
        publicPath: '/',
        filename: "bundle.js",
        assetModuleFilename: '[path][name].[ext]'
    },
    module: {
        rules,
    },
    resolve: {

        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.md', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            sourcePath,
        ],
        fallback: {
            "buffer": require.resolve('buffers'),
            "assert": require.resolve('assert/'),
            "fs": false,
            "os": false,
            "path": false,
            "zlib": require.resolve('browserify-zlib'),
            "stream": require.resolve('stream-browserify'),
            "crypto": false,

        } ,
    },
    plugins,
    optimization : {
        moduleIds: 'named',
        sideEffects: isProdEnv,
    },
    devServer: {
        contentBase: isNotDevEnv ? buildPath : sourcePath,
        historyApiFallback: true,
        port: 8080,
        compress: isNotDevEnv,
        inline: !isNotDevEnv,
        hot: !isNotDevEnv,
        host: "localhost",
        disableHostCheck: true,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            },
        },
    },
});
