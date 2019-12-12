#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const semver = require('semver');

if (process.argv.includes("-h")) {
    console.log("Usage: tank.bench-profile-compiler [path to your profile folder]");
    process.exit(-1);
}
if (process.argv.length === 2) {
    process.argv.push(".");
}

const profilePath = path.resolve(process.argv[2]);
const packagePath = path.resolve(profilePath, "package.json");

let pack;
try {
    pack = require(packagePath);
} catch (e) {
    console.error("package.json not found in " + profilePath);
    process.exit(-1);
}

if (!pack.main) {
    console.error('Please specify the entrypoint of your profile in package.json with the "main" property');
    process.exit(-1);
}
const entry = path.resolve(profilePath, pack.main);

const nodeModulesPath = path.resolve(profilePath, "node_modules");
const packageLockPath = path.resolve(profilePath, "package-lock.json");
if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(packageLockPath)) {
    console.error("Please run\nnpm install " + profilePath + "\nbefore compiling the profile");
    process.exit(-1);
}

let packageLock = require(packageLockPath);
Object.keys(packageLock.dependencies).forEach((depName) => {
    try {
        const depInfo = packageLock.dependencies[depName];
        if (depInfo.optional)
            return;

        const depPath = path.resolve(nodeModulesPath, depName);
        const depPackagePath = path.resolve(depPath, "package.json");
        const depPackage = require(depPackagePath);
        const depEngines = depPackage.engines;
        if (!depEngines)
            return;

        const depNode = depEngines.node;
        if (!depNode)
            return;

        if (!semver.satisfies(process.versions.node, depNode)) {
            console.error("The " + depName + " package do not satisfy node version requirements\n" +
                "It requires:       " + depNode + "\n" +
                "Your node version: " + process.versions.node);
            process.exit(-1);
        }

    } catch (e) {
        console.error("Please rerun\nnpm install " + profilePath + "\nbefore compiling the profile");
        process.exit(-1);
    }
});

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

console.log("Compiling the profile...");

require("webpack-cli");
