'use strict';

const HttpUtils = require('./http-utils');
const ParserUtils = require('./xml-parser-utils');
const msg = require('./messages');

module.exports = {

    _GetCapabilitiesTemplate: `
        <wps:GetCapabilities service="WPS"
            xmlns:ows="http://www.opengis.net/ows/2.0"
            xmlns:wps="http://www.opengis.net/wps/2.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.opengis.net/wps/2.0 ../wps.xsd">
        </wps:GetCapabilities>
    `,

    _processResponse: function _processResponse(response) {

        // Check connection errors
        HttpUtils.assertResponseOk(response);

        // Check header content-type to be xml
        HttpUtils.assertResponseToBeXML(response);

        // Parse the response
        const parsedDocument = ParserUtils.unmarshalString(response.text);
        const rawDocument = response.text;
        const simplerDocument = parsedDocument.value;

        return {
            parsedData: parsedDocument,
            rawData: rawDocument,
            data: simplerDocument
        };

    },

    executeGet: function executeGet(url) {

        return new Promise( (resolve, reject) => {

            // Get the GetCapabilities document
            HttpUtils.getXML(url).then( (response) => {

                try {
                    resolve(this._processResponse(response));
                } catch(msg) {
                    reject(msg);
                }

            });

        });

    },

    executePost: function executePost(url) {

        return new Promise( (resolve, reject) => {

            // Get the GetCapabilities document
            HttpUtils.postXML(url, this._GetCapabilitiesTemplate).then( (response) => {

                try {
                    resolve(this._processResponse(response));
                } catch(msg) {
                    reject(msg);
                }

            });

        });

    }

}