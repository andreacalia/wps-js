'use strict';

const request = require('superagent');

module.exports = {

    getXML: function getXML(url) {

        return new Promise((resolve, reject) => {
            request
                .get(url)
                .set('Accept', 'application/xml')
                .buffer()
                .end((error, result) => {
                    error ? reject(error) : resolve(result);
                });
        })
    }

};