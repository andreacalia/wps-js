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

    it('should perform a GetCapabilities request (using example B.4.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'GetCapabilities';

        GetCapabilities.execute(url)
            .then((response) => {

                expect(response.data.serviceIdentification.title[0].value).to.equal('MyWebProcessingService');
                expect(response.jsonixData.value.serviceIdentification.title[0].value).to.equal('MyWebProcessingService');
                expect(response.rawData).to.contain('<ows:Title>MyWebProcessingService</ows:Title>');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

});