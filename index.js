const path = require('path');
const fs = require('fs');
const semver = require('semver');
const webpack = require('webpack');
const webpackConfig = require(path.resolve(__dirname, "webpack.config.js"));

module.exports = async function compileProfile(profileDir, silent = false) {
    const profilePath = path.resolve(profileDir);
    const packagePath = path.resolve(profilePath, "package.json");

    let pack;
    try {
        pack = require(packagePath);
    } catch (e) {
        console.log(e);
        throw new Error("package.json not found in " + profilePath);
    }

    if (!pack.main) {
        throw new Error('Please specify the entrypoint of your profile in package.json with the "main" property');
    }

    const entry = path.resolve(profilePath, pack.main);

    const nodeModulesPath = path.resolve(profilePath, "node_modules");
    const packageLockPath = path.resolve(profilePath, "package-lock.json");

    if (!fs.existsSync(packageLockPath)) {
        throw new Error(`Please run npm install ${profilePath} before compiling the profile`);
    }

    if (fs.existsSync(nodeModulesPath)) {
        let packageLock = require(packageLockPath);

        Object.keys(packageLock.dependencies).forEach((depName) => {
            const depInfo = packageLock.dependencies[depName];
            if (depInfo.optional)
                return;

            const depPath = path.resolve(nodeModulesPath, depName);
            const depPackagePath = path.resolve(depPath, "package.json");

            let depPackage = undefined;
            try {
                depPackage = require(depPackagePath);
            } catch (e) {
                throw new Error(`Please run npm install ${profilePath} before compiling the profile`);
            }

            const depEngines = depPackage.engines;
            if (!depEngines)
                return;

            const depNode = depEngines.node;
            if (!depNode)
                return;

            if (!semver.satisfies(process.versions.node, depNode)) {
                throw new Error("The " + depName + " package do not satisfy node version requirements\n" +
                    "It requires:       " + depNode + "\n" +
                    "Your node version: " + process.versions.node);
            }
        });
    }

    let tsconfig = path.resolve(profilePath, "tsconfig.json");
    if (!fs.existsSync(tsconfig)) {
        tsconfig = path.resolve(__dirname, "tsconfig.json");
    }

    const wpConfig = webpackConfig(entry, profilePath, tsconfig);

    console.log(`Compiling the profile ${pack.name}...`);

    return new Promise((resolve) => {
        webpack(wpConfig, (err, stats) => {
            if (err) {
                if (!silent) {
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                }
                throw err;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                if (!silent) {
                    info.errors.forEach(error => {
                        console.error(error);
                    })
                }
                throw new Error(info.errors[0]);
            }

            if (stats.hasWarnings() && !silent) {
                info.warnings.forEach(warning => {
                    console.warn(warning);
                });
            }

            console.log(`The profile ${pack.name} is compiled!`);
            resolve({
                output: `${profilePath}/dist/profile.js`
            });
        });
    });
};
