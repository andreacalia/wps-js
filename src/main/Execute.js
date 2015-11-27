'use strict';

const _ = require('lodash');
const HttpUtils = require('./http-utils');
const ParserUtils = require('./xml-parser-utils');
const Consts = require('./constants');
const msg = require('./messages');

module.exports = {

    _ReferenceTemplate: _.template(`
        <wps:Reference
            <%
            /* Schema */ if( input.schema ) print('schema="' + input.schema + '"');
            /* Mime type */ if( input.mimeType ) print('mimeType="' + input.mimeType + '"');
            /* Encoding */ if( input.encoding ) print('encoding="' + input.encoding + '"');
            %>
            xlink:href="<%= input.href %>">

            <% if( input.requestBody ) { /* It has a Request Body */ %>
                <RequestBody>
                    <% /* It can have either a Body or a BodyReference */
                    if( input.requestBody.body ) print('<Body>' + input.requestBody.body + '</Body>');
                    else if( input.requestBody.bodyReference ) print('<BodyReference xlink:href="' + input.requestBody.bodyReference + '"/>');
                    %>
                </RequestBody>
            <% } %>

        </wps:Reference>
    `),

    _OutputTemplate: _.template(`
        <wps:Output
            <%
            /* Schema */ if( output.schema ) print('schema="' + output.schema + '"');
            /* Mime type */ if( output.mimeType ) print('mimeType="' + output.mimeType + '"');
            /* Encoding */ if( output.encoding ) print('encoding="' + output.encoding + '"');
            /* Transmission */ if( output.transmission ) print('transmission="' + output.transmission + '"');
            /* Id */ if( output.id ) print('id="' + output.id + '"');
            %>
            >
        </wps:Output>
    `),

    _ComplexTemplate: _.template(`
        <wps:ComplexData>
            <wps:Format
            <%
            /* Schema */ if( input.schema ) print('schema="' + input.schema + '"');
            /* Mime type */ if( input.mimeType ) print('mimeType="' + input.mimeType + '"');
            /* Encoding */ if( input.encoding ) print('encoding="' + input.encoding + '"');
            %>
            />
            <%= input.content %>
        </wps:ComplexData>
    `),

    _InputTemplate: _.template(`
        <wps:Input id="<%= identifier %>">
            <%
                if( wrapWithDataElement ) print('<wps:Data>' + content + '</wps:Data>');
                else print(content);
            %>
        </wps:Input>
    `),

    _ExecuteTemplate: _.template(`
        <wps:Execute
            xmlns:wps="http://www.opengis.net/wps/2.0"
            xmlns:ows="http://www.opengis.net/ows/2.0"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.opengis.net/wps/2.0 ../wps.xsd"
            service="WPS" version="2.0.0" response="document" mode="<%= mode %>">

            <ows:Identifier><%= identifier %></ows:Identifier>

            <%= inputs %>

            <%= outputs %>

        </wps:Execute>
    `),

    _createOutputMarkup: function _createOutputMarkup(output) {
        return this._OutputTemplate({
            output: output
        });
    },

    _createInputMarkup: function _createInputMarkup(input) {

        let content = null;

        if( input.type === Consts.REFERENCE_TYPE ) content = this._ReferenceTemplate({input: input});
        else if( input.type === Consts.COMPLEX_TYPE ) content = this._ComplexTemplate({input: input});
        else if( input.type === Consts.LITERAL_TYPE ) throw msg.errors.NOT_IMPLEMENTED('Literal Data input');
        else if( input.type === Consts.BOUNDING_BOX_TYPE ) throw msg.errors.NOT_IMPLEMENTED('Bounding Box input');
        else if( input.type === Consts.INPUT_TYPE ) throw msg.errors.NOT_IMPLEMENTED('nested inputs');
        else throw msg.errors.INPUT_PARAMETERS_NOT_VALID('Input type must be a Reference, Complex, Literal, nested Input or Bounding Box');

        return this._InputTemplate({
            identifier: input.identifier,
            content: content,
            wrapWithDataElement: input.type === Consts.COMPLEX_TYPE || input.type === Consts.LITERAL_TYPE || input.type === Consts.BOUNDING_BOX_TYPE // These data types must be wrapped with a Data XML element
        });
    },

    _createExecuteMarkup: function _createExecuteMarkup(params) {

        const inputsMarkup = params.inputs ?
            _.reduce(params.inputs, (acc, input) => { return acc + this._createInputMarkup(input); }, '') : '';

        const outputsMarkup = params.outputs ?
            _.reduce(params.outputs, (acc, output) => { return acc + this._createOutputMarkup(output); }, '') : '';

        return this._ExecuteTemplate({
            mode: params.mode,
            identifier: params.identifier,
            inputs: inputsMarkup,
            outputs: outputsMarkup
        });
    },

    _processResponse: function _processResponse(response) {

        // Check connection errors
        HttpUtils.assertResponseOk(response);

        // Check header content-type to be xml
        HttpUtils.assertResponseToBeXML(response);

        // Parse the response
        const parsedDocument = ParserUtils.unmarshalString(response.body);
        const rawDocument = response.body;
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

    executePost: function executePost(url, params) {

        return new Promise( (resolve, reject) => {

            // Get the document
            HttpUtils.postXML(url, this._createExecuteMarkup(params)).then( (response) => {

                try {
                    resolve(this._processResponse(response));
                } catch(msg) {
                    reject(msg);
                }

            });

        });

    }

}