#!/usr/bin/env node
const compileProfile = require("./index");

if (process.argv.includes("-h")) {
    console.log("Usage: bpc [path to your profile folder]");
    process.exit(-1);
}

compileProfile(process.argv[2] || ".").then(done => {
    console.log("Profile is compiled, output file:");
    console.log(done.output);
    process.exit(0);
}).catch(() => {
    process.exit(-1);
});
