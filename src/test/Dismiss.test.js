'use strict';

const expect = require('chai').expect;
const server = require('./server/test-server');
const Dismiss = require('../main/Dismiss');

const testPort = 3005;
const testURL = `http://localhost:${testPort}/`;

describe('Dismiss', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    it('should perform a Dismiss GET request (using example B.9.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'Dismiss';

        Dismiss.executeGet(url)
            .then((response) => {

                expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
                expect(response.data.status).to.equal('Dismissed');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

    it('should perform a Dismiss POST request (using example B.9.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'Dismiss';
        const inputs = {
            jobID: 'FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66'
        };

        Dismiss.executePost(url, inputs)
            .then((response) => {

                expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
                expect(response.data.status).to.equal('Dismissed');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

});