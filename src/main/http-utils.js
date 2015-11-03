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

    }

};