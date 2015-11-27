'use strict';

const expect = require('chai').expect;
const server = require('./server/test-server');
const Execute = require('../main/Execute');
const Consts = require('../main/constants');

const testPort = 3005;
const testURL = `http://localhost:${testPort}/`;

describe('Execute', function() {

    before(function(done){

        server.start(testPort, done);

    });

    after(function(done){

        server.stop(done);

    });

    describe('request XML correctness', function() {

        it('should support Reference input', function() {

            const params = {
                mode: 'async',
                identifier: 'testID',
                inputs: [
                    {
                        type: Consts.REFERENCE_TYPE,
                        identifier: 'testInput',
                        mimeType: 'text/xml',
                        schema: 'http://schemas.opengis.net/gml/3.1.1/base/gml.xsd',
                        encoding: 'utf-8',
                        href: 'http://myserver.com'
                    }]
            };

            const query = Execute._createExecuteMarkup(params);

            expect(query).to.contain(`<wps:Reference`);
            expect(query).to.contain(`mimeType="${params.inputs[0].mimeType}"`);
            expect(query).to.contain(`schema="${params.inputs[0].schema}"`);
            expect(query).to.contain(`encoding="${params.inputs[0].encoding}"`);
            expect(query).to.contain(`href="${params.inputs[0].href}"`);

        });

        it('should support RequestBody/Body in Reference input', function() {

            const params = {
                mode: 'async',
                identifier: 'testID',
                inputs: [
                    {
                        type: Consts.REFERENCE_TYPE,
                        identifier: 'testInput',
                        mimeType: 'text/xml',
                        schema: 'http://schemas.opengis.net/gml/3.1.1/base/gml.xsd',
                        encoding: 'utf-8',
                        href: 'http://someurl.com',
                        requestBody: {
                            body: '<anyXML></anyXML>'
                        }
                    }]
            };

            const query = Execute._createExecuteMarkup(params);

            expect(query).to.contain(`<RequestBody>`);
            expect(query).to.contain(`</RequestBody>`);
            expect(query).to.contain(`<Body>`);
            expect(query).to.contain(`</Body>`);
            expect(query).to.contain(`${params.inputs[0].requestBody.body}`);

        });

        it('should support RequestBody/BodyReference in Reference input', function() {

            const params = {
                mode: 'async',
                identifier: 'testID',
                inputs: [
                    {
                        type: Consts.REFERENCE_TYPE,
                        identifier: 'testInput',
                        mimeType: 'text/xml',
                        schema: 'http://schemas.opengis.net/gml/3.1.1/base/gml.xsd',
                        encoding: 'utf-8',
                        href: 'http://someurl.com',
                        requestBody: {
                            bodyReference: 'http://someotherurl.com'
                        }
                    }]
            };

            const query = Execute._createExecuteMarkup(params);

            expect(query).to.contain(`<RequestBody>`);
            expect(query).to.contain(`</RequestBody>`);
            expect(query).to.contain(`<BodyReference xlink:href="${params.inputs[0].requestBody.bodyReference}"/>`);

        });

        it('should support Output', function() {

            const params = {
                mode: 'async',
                identifier: 'testID',
                inputs: [
                    {
                        type: Consts.REFERENCE_TYPE,
                        identifier: 'testInput',
                        mimeType: 'text/xml',
                        schema: 'http://schemas.opengis.net/gml/3.1.1/base/gml.xsd',
                        encoding: 'utf-8',
                        href: 'http://someurl.com',
                        requestBody: {
                            bodyReference: 'http://someotherurl.com'
                        }
                    }
                ],
                outputs: [
                    {
                        mimeType: 'text/xml',
                        schema: 'http://schemas.opengis.net/gml/3.1.1/base/gml.xsd',
                        encoding: 'utf-8',
                        transmission: 'reference',
                        id: 'myoutput'
                    }
                ]
            };

            const query = Execute._createExecuteMarkup(params);

            expect(query).to.contain(`<wps:Output`);
            expect(query).to.contain(`</wps:Output>`);
            expect(query).to.contain(`schema="${params.outputs[0].schema}"`);
            expect(query).to.contain(`mimeType="${params.outputs[0].mimeType}"`);
            expect(query).to.contain(`transmission="${params.outputs[0].transmission}"`);
            expect(query).to.contain(`encoding="${params.outputs[0].encoding}"`);
            expect(query).to.contain(`id="${params.outputs[0].id}"`);

        });

    });

    //it('should create the Execute request XML correctly', function() {
    //
    //    const params = {
    //        mode: 'async',
    //        identifier: 'testID',
    //        inputs: [
    //            {
    //                identifier: 'inputid',
    //                mimeType: 'typeasd',
    //                schema: 'oneSchema',
    //                encoding: 'utf-8',
    //                asReference: 'true'
    //            }]
    //    };
    //
    //    const query = Execute._ExecuteTemplate(params);
    //
    //    expect(query).to.contain(`<wps:Input id="${params.inputs[0].identifier}">`);
    //    expect(query).to.contain(`mimeType="${params.inputs[0].mimeType}"`);
    //    //expect(query).to.contain(`schema="${params.inputs[0].schema}"`);
    //    //expect(query).to.contain(`encoding="${params.inputs[0].encoding}"`);
    //
    //});

    //it('should perform a Execute GET request (using example B.7.2 of WPS Standard)', function(done) {
    //
    //    this.timeout(2000);
    //
    //    const url = testURL + 'Execute';
    //
    //    Execute.executeGet(url)
    //        .then((response) => {
    //
    //            expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
    //            expect(response.data.status).to.equal('Running');
    //            expect(response.rawData).to.contain('<wps:NextPoll>2014-12-24T16:00:00Z</wps:NextPoll>');
    //
    //        })
    //        .then(done)
    //        .catch((err) => console.log('Error:', err));
    //
    //});
    //
    //it('should perform a Execute POST request (using example B.7.2 of WPS Standard)', function(done) {
    //
    //    this.timeout(2000);
    //
    //    const url = testURL + 'Execute';
    //    const inputs = {
    //        jobID: 'FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66'
    //    };
    //
    //    Execute.executePost(url, inputs)
    //        .then((response) => {
    //
    //            expect(response.data.jobID).to.equal('FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66');
    //            expect(response.data.status).to.equal('Running');
    //            expect(response.rawData).to.contain('<wps:NextPoll>2014-12-24T16:00:00Z</wps:NextPoll>');
    //
    //        })
    //        .then(done)
    //        .catch((err) => console.log('Error:', err));
    //
    //});

});