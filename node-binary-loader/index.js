/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Algys Ievlev @algys
*/
const fs = require("fs");
const path = require('path');

module.exports = function() {
  const binary = fs.readFileSync(this.resourcePath);
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(binary);
  const filename = path.basename(this.resourcePath) + "-" + hash.digest('hex');

  return "{" +
      "const base64_module = '" + binary.toString('base64') + "'; " +
      "const binary_module = new Buffer(base64_module, 'base64'); " +
      "const fs = require('fs');" +
      "const filename = '" + filename + "'; " +
      "try {" +
      "if(!fs.existsSync(filename)){" +
      "fs.writeFileSync(/tmp/filename, binary_module);} " +
      "global.process.dlopen(module, /tmp/filename); } catch(e) {" +
      "throw new Error('Cannot open ' + filename + ': ' + e);} }";
}
