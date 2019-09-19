#!/usr/bin/env node
const path = require('path');

if (process.argv.length !== 3 || process.argv.includes("-h")) {
    console.log("Usage: tank.bench-profile-compiler [path to your profile folder]");
    process.exit(0);
}

const profilePath = path.resolve(__dirname, process.argv[2]);
process.argv = process.argv.slice(0, 2);

const pack = require(path.resolve(profilePath, "package.json"));
const entry = "./" + path.relative(__dirname, path.resolve(profilePath, pack.main));
const tsconfig = path.resolve(profilePath, "tsconfig.json");

module.exports = {
    entry: entry,
    tsconfig: tsconfig
};

require("webpack-cli");
