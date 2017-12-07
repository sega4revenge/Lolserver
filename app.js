'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const router        = express.Router();
const logger        = require('morgan');
const server = require("http").createServer(app);
const port        = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(logger('dev'));


require('./routeslol')(router);
app.use('/api/v2', router);
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});



