'use strict';

const _ = require('lodash');
const http = require('http');
const urlUtils = require('url');
const msg = require('./messages');

module.exports = {

    /**
     * Perform a HTTP GET request to the specified URL. It accepts text/xml and application/xml content
     * @param urlString String - url of the request
     * @returns {Promise}
     *      Resolve: Object - {
     *          body: data sent from the server
     *          url: the url object parsed using Node url module
     *          incomingMessage: the IncomingMessage Node object representing the request
     *      }
     *
     *      Reject: String | Error - message or Error occurred
     */
    getXML: function getXML(urlString) {

        // Parse the url into a Node object
        const url = urlUtils.parse(urlString);

        // Promise body
        const executor = (resolve, reject) => {

            // Perform the request
            http.request({
                method: 'GET',
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: url.path,
                headers: {
                    'Accept': 'text/xml;application/xml'
                }
            })
            .on('response', (response) => {

                let data = '';

                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {

                    // build the response with useful data
                    const responsePack = {
                        body: data, // collected data
                        url: url, // parsed url
                        incomingMessage: response // IncomingMessage Node class
                    };

                    resolve(responsePack)
                });

            })
            .on('error', (error) => reject(error))
            .end();

        };

        return new Promise(executor);
    },

    /**
     * Perform a POST GET request to the specified URL. Data parameter is sent along the request. It accepts text/xml and application/xml content
     * @param urlString String - url of the request
     * @param data String - payload of the request
     * @returns {Promise}
     *      Resolve: Object - {
     *          body: data sent from the server
     *          url: the url object parsed using Node url module
     *          incomingMessage: the IncomingMessage Node object representing the request
     *      }
     *
     *      Reject: String | Error - message or Error occurred
     */
    postXML: function postXML(urlString, data) {

        // Parse the url into a Node object
        const url = urlUtils.parse(urlString);

        // Promise body
        const executor = (resolve, reject) => {

            // Body must be a string
            if( !_.isString(data) )
                reject(msg.errors.POST_BODY_MUST_BE_STRING);

            // Perform the request
            http.request({
                method: 'POST',
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: url.path,
                headers: {
                    'Content-Length': data.length,
                    'Content-type': 'text/xml',
                    'Accept': 'text/xml;application/xml'
                }
            })
            .on('response', (response) => {

                let data = '';

                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {

                    // build the response with useful data
                    const responsePack = {
                        body: data, // collected data
                        url: url, // parsed url
                        incomingMessage: response // IncomingMessage Node class
                    };

                    resolve(responsePack)
                });

            })
            .on('error', (error) => reject(error))
            .end(data);

        };

        return new Promise(executor);
    },

    /**
     * Assert that the given response is ok (HTTP status 200)
     * @param response Object - the response of one of the http-utils (this file) method
     * @throws String - error message
     */
    assertResponseOk: function assertResponseOk(response) {

        if( response.incomingMessage.statusCode !== 200 )
            throw msg.errors.CONNECTION_ERROR(response.url.href, response.incomingMessage.statusCode);

    },

    /**
     * Assert that the given response has content-type of either application/xml or text/xml
     * @param response Object - the response of one of the http-utils (this file) method
     * @throws String - error message
     */
    assertResponseToBeXML: function assertResponseToBeXML(response) {

        if( response.incomingMessage.headers['content-type'] !== 'application/xml' && response.incomingMessage.headers['content-type'] !== 'text/xml' )
            throw msg.errors.NOT_XML(response.url.href, response.incomingMessage.headers['content-type']);

    }

};