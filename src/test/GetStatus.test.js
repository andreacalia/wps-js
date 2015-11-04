'use strict';

const expect = require('chai').expect;
const server = require('./server/test-server');
const GetStatus = require('../main/GetStatus');

const testPort = 3005;
const testURL = `http://localhost:${testPort}/`;

describe('GetStatus', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    it('should perform a GetStatus GET request (using example B.7.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetStatus';

        GetStatus.executeGet(url)
            .then((response) => {

                expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
                expect(response.data.status).to.equal('Running');
                expect(response.rawData).to.contain('<wps:NextPoll>2014-12-24T16:00:00Z</wps:NextPoll>');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

    it('should perform a GetStatus POST request (using example B.7.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetStatus';
        const inputs = {
            jobID: 'FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66'
        };

        GetStatus.executePost(url, inputs)
            .then((response) => {

                expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
                expect(response.data.status).to.equal('Running');
                expect(response.rawData).to.contain('<wps:NextPoll>2014-12-24T16:00:00Z</wps:NextPoll>');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

});