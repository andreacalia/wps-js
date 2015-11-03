'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES
app.get('/getXML', (req, res) => {

    res.set({
        'Content-Type': 'application/xml'
    });
    res.send('<hello></hello>');

});

app.get('/GetCapabilities', (req, res) => {

    const options = {
        root: __dirname + '/../asset/'
    };

    res.sendFile('WPS_B.4.2.xml', options);

});

// INIT
let server = null;

const start = (port, callback) => {
    server = app.listen(port, callback);
};

const stop = (callback) => {
    server.close(callback);
};

module.exports = {
    start: start,
    stop: stop
};