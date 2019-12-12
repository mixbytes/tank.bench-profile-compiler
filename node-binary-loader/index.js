/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Algys Ievlev @algys
*/
const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

module.exports = function () {
    const hex = fs.readFileSync(this.resourcePath).toString('hex');
    const hash = crypto.createHash('md5').update(hex);
    const filename = path.basename(this.resourcePath) + "-" + hash.digest('hex');

    return `
        {
            const hex_module = '${hex}';
            const buffer = Uint8Array.from(Buffer.from(hex_module, 'hex'));
            const fs = require('fs');
            try {
                if (!fs.existsSync('${filename}')) {
                    fs.writeFileSync('/tmp/${filename}', buffer);
                    global.process.dlopen(module, '/tmp/${filename}');
                } 
            } catch(e) {
                throw new Error('Cannot open ' + '${filename}' + ': ' + e);
            }
         }
     `;
};
