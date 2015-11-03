'use strinct';

const expect = require('chai').expect;

module.exports = (app) => {

    app.get('/GetCapabilities', (req, res) => {

        const options = {
            root: __dirname + '/../asset/'
        };

        res.sendFile('WPS_B.4.2.xml', options);

    });

    app.post('/GetCapabilities', (req, res) => {

        expect(req.rawBody).to.contain('<wps:GetCapabilities');
        expect(req.rawBody).to.contain('</wps:GetCapabilities>');

        const options = {
            root: __dirname + '/../asset/'
        };

        res.sendFile('WPS_B.4.2.xml', options);

    });

}