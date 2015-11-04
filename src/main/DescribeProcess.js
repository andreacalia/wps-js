'use strict';

const _ = require('lodash');
const HttpUtils = require('./http-utils');
const ParserUtils = require('./xml-parser-utils');
const msg = require('./messages');

module.exports = {

    _DescribeProcessTemplate: _.template(`
        <wps:DescribeProcess service="WPS" version="2.0.0"
            xmlns:ows="http://www.opengis.net/ows/2.0"
            xmlns:wps="http://www.opengis.net/wps/2.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.opengis.net/wps/2.0 ../wps.xsd">
            <% _.forEach(identifiers, function(id) { %>
                <ows:Identifier><%= id %></ows:Identifier>
            <% }); %>
            <% if( typeof lang !== 'undefined' ) { %>
                <xml:lang><%= lang %></xml:lang>
            <% } %>
        </wps:DescribeProcess>
    `),

    _processResponse: function _processResponse(response) {

        // Check connection errors
        if( !response.ok )
            throw msg.errors.CONNECTION_ERROR(response.request.url, response.status);

        // Check header content-type to be xml
        if( response.header['content-type'] !== 'application/xml' && response.header['content-type'] !== 'text/xml' )
            throw msg.errors.NOT_XML(response.request.url, response.header['content-type']);

        // Parse the response
        let parsedDocument = null;
        try {
            parsedDocument = ParserUtils.unmarshalString(response.text);
        } catch(error) {
            throw msg.errors.XML_PARSING_ERROR(error);
        }

        let rawDocument = response.text;

        return {
            rawData: rawDocument,
            data: parsedDocument.value,
            jsonixData: parsedDocument
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
            HttpUtils.postXML(url, this._DescribeProcessTemplate(inputs)).then( (response) => {

                try {
                    resolve(this._processResponse(response));
                } catch(msg) {
                    reject(msg);
                }

            });

        });

    }

}