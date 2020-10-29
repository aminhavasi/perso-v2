const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
require('dotenv').config();
const { db } = require('./src/db/mongoose');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const path = require('path');
//---------------------------------------------------
db(); //db connect-----------------------------------

const accessLogStream = rfs.createStream('httpLoger.log', {
    interval: '1d',
    path: path.resolve(__dirname + '/src/logs'),
});
app.use(morgan('combined', { stream: accessLogStream }));

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
