const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
require('dotenv').config();
const { db } = require('./src/db/mongoose');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
//---------------------------------------------------
db(); //db connect-----------------------------------
const corsOptions = {
    exposedHeaders: 'x-auth ',
};
app.use(express.json());
app.use(cors(corsOptions));
const accessLogStream = rfs.createStream('httpLoger.log', {
    interval: '1d',
    path: path.resolve(__dirname + '/src/logs'),
});
app.use(morgan('combined', { stream: accessLogStream }));
app.use('/api/index', require('./src/routes/index'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/posts',require('./src/routes/posts'))
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
