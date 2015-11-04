'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

// Just raw body if request is xml kind
const rawBody = function rawBody(req, res, next) {

    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function(){
        next();
    });

};
app.use(rawBody);
app.use(bodyParser.json());

// ROUTES
require('./GetCapabilities.route')(app);
require('./DescribeProcess.route')(app);
require('./GetStatus.route')(app);
require('./Dismiss.route')(app);

app.get('/getXML', (req, res) => {

    res.set({
        'Content-Type': 'application/xml'
    });
    res.send('<hello></hello>');

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