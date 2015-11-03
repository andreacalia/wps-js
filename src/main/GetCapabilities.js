'use strict';

const HttpUtils = require('./http-utils');
const JsonixUtils = require('./jsonix-utils');
const msg = require('./messages');

module.exports = {

    execute: function(url) {

        return new Promise( (resolve, reject) => {

            // Get the GetCapabilities document
            HttpUtils.getXML(url).then( (response) => {

                // Check connection errors
                if( !response.ok )
                    reject(msg.errors.CONNECTION_ERROR(url, response.status));

                // Check header content-type to be xml
                if( response.header['content-type'] !== 'application/xml' && response.header['content-type'] !== 'text/xml')
                    reject(msg.errors.NOT_XML(url, response.header['content-type']));

                // Parse the response
                let parsedDocument = null;
                try {
                    parsedDocument = JsonixUtils.unmarshalString(response.text);
                } catch(error) {
                    reject(msg.errors.JSONIX_PARSING_ERROR(error));
                }

                let rawDocument = response.text;

                resolve({
                    rawData: rawDocument,
                    data: parsedDocument.value,
                    jsonixData: parsedDocument
                });

            });

        });

    }

}