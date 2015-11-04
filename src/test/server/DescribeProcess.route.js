'use strinct';

const expect = require('chai').expect;

module.exports = (app) => {

    app.get('/DescribeProcess', (req, res) => {

        const options = {
            root: __dirname + '/../asset/'
        };

        res.sendFile('WPS_B.5.2.xml', options);

    });

    app.post('/DescribeProcess', (req, res) => {

        expect(req.rawBody).to.contain('<ows:Identifier>http://my.wps.server/processes/proximity/Planar-Buffer</ows:Identifier>');
        expect(req.rawBody).to.contain('<wps:DescribeProcess');
        expect(req.rawBody).to.contain('</wps:DescribeProcess>');

        const options = {
            root: __dirname + '/../asset/'
        };

        res.sendFile('WPS_B.5.2.xml', options);

    });

}