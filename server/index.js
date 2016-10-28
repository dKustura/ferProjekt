const express = require('express');
const path = require('path');
const dbconfig = require('./config');
const mongoose = require('mongoose');

const app = express();
const DB = 'mongodb://' + config.databaseUsername + ':' + config.databasePassword + '@ds011664.mlab.com:11664/projektbaza';

mongoose.connect(DB);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// serve static files from /public folder
const pathToPublicFolder = path.resolve(__dirname + '/public');
app.use('/public', express.static(pathToPublicFolder));

app.set('view engine', 'ejs');

// start listening on port 4242
app.listen(4242, function () {
  console.log('App running on http://localhost:4242 (Ctrl + click to open)');
});
