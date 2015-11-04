'use strict';

const expect = require('chai').expect;
const server = require('./server/test-server');
const DescribeProcess= require('../main/DescribeProcess');

const testPort = 3005;
const testURL = `http://localhost:${testPort}/`;

describe('DescribeProcess', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    it('should perform a DescribeProcess GET request (using example B.5.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'DescribeProcess';

        DescribeProcess.executeGet(url)
            .then((response) => {

                expect(response.data.processOffering[0].process.identifier.value).to.contain('http://my.wps.server/processes/proximity/Planar-Buffer');
                expect(response.data.processOffering[0].process.input[0].title[0].value).to.equal('Geometry to be buffered');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

    it('should perform a DescribeProcess POST request (using example B.5.2 of WPS Standard)', function(done) {

        this.timeout(2000);

        const url = testURL + 'DescribeProcess';
        const inputs = {
            identifiers: ['http://my.wps.server/processes/proximity/Planar-Buffer'],
            lang: 'en'
        };

        DescribeProcess.executePost(url, inputs)
            .then((response) => {

                expect(response.data.processOffering[0].process.identifier.value).to.contain('http://my.wps.server/processes/proximity/Planar-Buffer');
                expect(response.data.processOffering[0].process.input[0].title[0].value).to.equal('Geometry to be buffered');

            })
            .then(done)
            .catch((err) => console.log('Error:', err));

    });

});