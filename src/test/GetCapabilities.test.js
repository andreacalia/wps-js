'use strict';

const expect = require('chai').expect;
const server = require('./server/test-server');
const GetCapabilities = require('../main/GetCapabilities');

const testPort = 3005;
const testURL = `http://localhost:${testPort}/`;

describe('GetCapabilities', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    it('should perform a GetCapabilities GET request (using example B.4.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetCapabilities';

        GetCapabilities.executeGet(url)
            .then((response) => {

                expect(response.data.serviceIdentification.title[0].value).to.equal('MyWebProcessingService');
                expect(response.parsedData.value.serviceIdentification.title[0].value).to.equal('MyWebProcessingService');
                expect(response.rawData).to.contain('<ows:Title>MyWebProcessingService</ows:Title>');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

    it('should perform a GetCapabilities POST request (using example B.4.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetCapabilities';

        GetCapabilities.executePost(url)
            .then((response) => {

                expect(response.data.serviceIdentification.title[0].value).to.equal('MyWebProcessingService');
                expect(response.parsedData.value.serviceIdentification.title[0].value).to.equal('MyWebProcessingService');
                expect(response.rawData).to.contain('<ows:Title>MyWebProcessingService</ows:Title>');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

});