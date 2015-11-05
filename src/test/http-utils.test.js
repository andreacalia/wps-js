'use strict';

var expect = require('chai').expect;
var HttpUtils = require( '../main/http-utils.js');
var server = require('./server/test-server');

var testPort = 3005;
var testURL = `http://localhost:${testPort}/`;

describe('HTTP utils', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    it('should perform a simple GET request', function(done) {

        this.timeout(2000);

        HttpUtils.getXML(testURL + 'getXML').then((response) => {

            expect(response.body).to.equal('<hello></hello>');
            done();

        }).catch((err) => console.error('Error:', err));

    });

});