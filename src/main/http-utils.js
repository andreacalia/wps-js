'use strict';

const request = require('superagent');

module.exports = {

    get: function get(url) {

        return new Promise((resolve, reject) => {
            request
                .get(url)
                .end((error, result) => {
                    error ? reject(error) : resolve(result);
                });
        })
    }

};