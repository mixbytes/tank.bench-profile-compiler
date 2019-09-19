#!/usr/bin/env node
const path = require('path');

if (process.argv.includes("-h")) {
    console.log("Usage: tank.bench-profile-compiler [path to your profile folder]");
    process.exit(0);
}
if (process.argv.length === 2) {
    process.argv.push(".");
}

console.log("Compiling the profile...");

const profilePath = path.resolve(process.argv[2]);
const pack = require(path.resolve(profilePath, "package.json"));
const entry = path.resolve(profilePath, pack.main);
const tsconfig = path.resolve(profilePath, "tsconfig.json");
const webpackConfig = path.resolve(__dirname, "webpack.config.js");

process.argv = process.argv.slice(0, 2);
process.argv.push("--config");
process.argv.push(webpackConfig);

module.exports = {
    entry: entry,
    profilePath: profilePath,
    tsconfig: tsconfig
};

require("webpack-cli");
