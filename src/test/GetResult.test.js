'use strict';

const expect = require('chai').expect;
const server = require('./server/test-server');
const GetResult = require('../main/GetResult');

const testPort = 3005;
const testURL = `http://localhost:${testPort}/`;

describe('GetResult', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    it('should perform a GetResult GET request (using example B.6.3 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetResult';

        GetResult.executeGet(url)
            .then((response) => {

                expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
                expect(response.data.output[0].id).to.equal('BUFFERED_GEOMETRY');
                expect(response.rawData).to.contain('xlink:href="http://result.data.server/');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

    it('should perform a GetResult POST request (using example B.7.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetResult';
        const inputs = {
            jobID: 'FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66'
        };

        GetResult.executePost(url, inputs)
            .then((response) => {

                expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
                expect(response.data.output[0].id).to.equal('BUFFERED_GEOMETRY');
                expect(response.rawData).to.contain('xlink:href="http://result.data.server/');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

});