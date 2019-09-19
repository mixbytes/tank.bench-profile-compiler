const path = require('path');
const {CheckerPlugin} = require('awesome-typescript-loader');
const paths = require("./index");

module.exports = {
    target: "node",
    entry: {
        profile: paths.entry,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'profile',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    node: {
        fs: "empty"
    },
    // Add the loader for .ts files.
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: paths.tsconfig
                }
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
};
