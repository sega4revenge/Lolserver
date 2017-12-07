'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger        = require('morgan');
const router        = express.Router();

const server = require("http").createServer(app);
const port        = process.env.PORT || 8000;
const io = require("socket.io")(server);
app.use(bodyParser.json());
app.use(logger('dev'));


require('./routeslol')(router);
require('./socketio.js')(io);
app.use('/api/v2', router);
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});



