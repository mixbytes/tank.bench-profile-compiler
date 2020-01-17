const path = require('path');
const webpack = require("webpack");
// const analyzer = require("webpack-bundle-analyzer");

module.exports = function webpackConfig(entry, profilePath, tsconfig) {
    return {
        target: "node",
        mode: "development",
        context: profilePath,
        entry: {
            profile: "./" + path.relative(profilePath, entry),
        },
        externals: {},
        output: {
            path: path.resolve(profilePath, 'dist'),
            filename: 'profile.js',
            libraryTarget: 'umd',
            library: 'profile',
            umdNamedDefine: true
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        node: {
            fs: "empty"
        },
        module: {
            exprContextCritical: false,
            rules: [
                {
                    test: /\.ts$/,
                    loader: require.resolve('ts-loader'),
                    exclude: /node_modules/,
                    options: {
                        configFile: tsconfig
                    }
                },
                {
                    test: /\.node$/,
                    use: require.resolve("./node-binary-loader")
                }
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/^(tank\.bench-profile-compiler|tank\.bench-common)$/),
            // new analyzer.BundleAnalyzerPlugin({
            //     generateStatsFile: true
            // }),
        ]
    };
};
