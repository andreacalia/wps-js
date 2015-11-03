'use strict';

var fs = require('fs');

try {
    // TODO Check not found error and pass through other possible errors. Not found should contain Error: ENOENT
    var fileStats = fs.statSync('./dist/node/wps-js.js');

    // Check if the file exists
    if( ! fileStats.isFile() ) throw new Error();

    // Re-expose it
    module.exports = require('./dist/node/wps-js');

} catch(error) {
    console.log(error);

    throw new Error('File <./dist/node/wps-js.js> does not exists. Please run <npm run build-all> or <npm run build-node> to generate it.');
}
