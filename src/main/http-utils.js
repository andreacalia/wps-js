'use strict';

const request = require('superagent');

module.exports = {

    getXML: function getXML(url) {

        return new Promise((resolve, reject) => {
            request
                .get(url)
                .set('Accept', 'text/xml')
                .buffer()
                .end((error, result) => {
                    error ? reject(error) : resolve(result);
                });
        })

    },

    postXML: function postXML(url, data) {

        return new Promise((resolve, reject) => {
            request
                .post(url)
                .set('Content-type', 'text/xml')
                .set('Accept', 'text/xml')
                .send(data)
                .buffer()
                .end((error, result) => {
                    error ? reject(error) : resolve(result);
                });
        });

    },

    assertResponseOk: function assertResponseOk(response) {

        if( !response.ok )
            throw msg.errors.CONNECTION_ERROR(response.request.url, response.status);

    },

    assertResponseToBeXML: function assertResponseToBeXML(response) {

        if( response.header['content-type'] !== 'application/xml' && response.header['content-type'] !== 'text/xml' )
            throw msg.errors.NOT_XML(response.request.url, response.header['content-type']);

    }

};