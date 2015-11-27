'use strinct';

const expect = require('chai').expect;

module.exports = (app) => {

    app.get('/GetResult', (req, res) => {

        const options = {
            root: __dirname + '/../asset/'
        };

        res.sendFile('WPS_B.6.3.xml', options);

    });

    app.post('/GetResult', (req, res) => {

        expect(req.rawBody).to.contain('<wps:JobID>FB6DD4B0-A2BB-11E3-A5E2-0800200C9A66</wps:JobID>');

        const options = {
            root: __dirname + '/../asset/'
        };

        res.sendFile('WPS_B.6.3.xml', options);

    });

}