'use strict';

module.exports = {

    errors: {

        CONNECTION_ERROR: function(url, status) {
            return `Connection to ${url} failed. HTTP status ${status}`;
        },

        NOT_XML: function(url, contentType) {
            return `Requested document (${url}) should be XML. Instead it is ${contentType}`;
        },

        XML_PARSING_ERROR: function(error) {
            return `XML parser found an error while parsing: ${error}`;
        },

        POST_BODY_MUST_BE_STRING: function() {
            return 'POST body must be a string';
        }

    }

};