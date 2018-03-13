'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');
var httpsOptions = {
    key: fs.readFileSync('./privkey.pem'),
    cert: fs.readFileSync('./cert.pem'),
    requestCert: true,
    rejectUnauthorized: false
};

const router        = express.Router();
const logger        = require('morgan');

const server = https.createServer(httpsOptions,app);
const port        = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(logger('dev'));


require('./routeslol')(router);
app.use('/api/v2', router);
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});



