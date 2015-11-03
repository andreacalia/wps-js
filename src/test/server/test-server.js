const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES
app.get('/hello', (req, res) => res.send('hello'));


// INIT
var server = null;

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