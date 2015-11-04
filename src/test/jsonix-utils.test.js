'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const _ = require('lodash');
const JsonixUtils = require('../main/jsonix-utils');

describe('JSONIX utils', function() {

    it('should be able to parse XML samples from WPS 2.0 standard', function() {

        const examples = [
            'WPS_B.4.1.xml',
            'WPS_B.2.xml',
            'WPS_B.3.xml',
            'WPS_B.4.2.xml',
            'WPS_B.5.1.xml',
            'WPS_B.6.1.xml',
            'WPS_B.6.2.xml',
            'WPS_B.6.3.xml',
            'WPS_B.7.1.xml',
            'WPS_B.7.2.xml',
            'WPS_B.8.1.xml',
            'WPS_B.9.1.xml',
            'WPS_B.9.2.xml',
            'WPS_B.5.2.xml'
        ];

        const examplesFolder = './src/test/asset/';

        _.forEach(examples, (exampleFileName) => {

            const exampleText = fs.readFileSync(examplesFolder + exampleFileName, 'utf8');

            expect(() => {
                JsonixUtils.unmarshalString(exampleText)
            }).to.not.throw(Error);

        });

    });

});