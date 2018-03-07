'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./private.key', 'utf8');
var certificate = fs.readFileSync('./mydomain.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const router        = express.Router();
const logger        = require('morgan');
const server = https.createServer(credentials,app);
const port        = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(logger('dev'));


require('./routeslol')(router);
app.use('/api/v2', router);
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});



