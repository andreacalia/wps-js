'use strict';

const _ = require('lodash');
const HttpUtils = require('./http-utils');
const ParserUtils = require('./xml-parser-utils');

module.exports = {

    _DismissTemplate: _.template(`
        <wps:Dismiss service="WPS" version="2.0.0"
            xmlns:wps="http://www.opengis.net/wps/2.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.opengis.net/wps/2.0 ../wps.xsd ">
            <wps:JobID><%= jobID %></wps:JobID>
        </wps:Dismiss>
    `),

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

            // Get the document
            HttpUtils.getXML(url).then( (response) => {

                try {
                    resolve(this._processResponse(response));
                } catch(msg) {
                    reject(msg);
                }

            });

        });

    },

    executePost: function executePost(url, inputs) {

        return new Promise( (resolve, reject) => {

            // Get the document
            HttpUtils.postXML(url, this._DismissTemplate(inputs)).then( (response) => {

                try {
                    resolve(this._processResponse(response));
                } catch(msg) {
                    reject(msg);
                }

            });

        });

    }

}