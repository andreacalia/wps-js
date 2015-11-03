'use strict';

module.exports = {

    errors: {

        CONNECTION_ERROR: function(url, status) {
            return `Connection to ${url} failed. HTTP status ${status}`;
        },

        NOT_XML: function(url, contentType) {
            return `Requested document (${url}) should be XML. Instead it is ${contentType}`;
        },

        JSONIX_PARSING_ERROR: function(error) {
            return `JSONIX found an error while parsing: ${error}`;
        }

    }

};