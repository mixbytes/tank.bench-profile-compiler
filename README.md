# tank.bench-profile-compiler

[![npm version](https://badge.fury.io/js/tank.bench-profile-compiler.svg)](https://www.npmjs.com/package/tank.bench-profile-compiler)




## What is it?
The `tank.bench-profile-compiler` is a compiler for profiles, which can be used with
[mixbytes.tank](https://github.com/mixbytes/tank), the ultimate tool for setting up a blockchain cluster
in minutes in a cloud and bench it using various transaction loads.

Profile is a small project that specifies how to load the blockchain with transactions. You can know the details
about profiles in the [tank.bench-common](https://github.com/mixbytes/tank.bench-common) repository.

To run some specific load code to `mixbytes.tank`, you need to precompile it to a single js file.
The `tank.bench-profile-compiler` is a tool, that will help you to do it using one single command.


## How to use it?
The profile is a `node.js` project, containing `package.json` file with required dependencies.
To compile it with `tank.bench-profile-compiler` you follow the next steps:

0. Install nodejs v12 or higher
1. Install the dependencies with `npm install` command
2. Install the `tank.bench-profile-compiler` with `npm install -g tank.bench-profile-compiler` command
3. Run the `bpc` command in the folder with your project (or `bpc <folder of your project>`).


### What about the typescript?
`tank.bench-profile-compiler` is ready to work with typescript projects. If your project contains the 
`tsconfig.json`, the compiler will find it and use.


### Any examples?

You can find examples of valid profiles in `tank.bench-<blockchain_binding>`
[repos of the Mixbytes company](https://github.com/mixbytes/),
for example, [here](https://github.com/mixbytes/tank.bench-polkadot/tree/master/profileExamples/)
