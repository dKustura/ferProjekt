const express = require('express');
const path = require('path');

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// serve static files from /public folder
const pathToPublicFolder = path.resolve(__dirname + '/public');
app.use('/public', express.static(pathToPublicFolder));

// start listening on port 4242
app.listen(4242, function () {
  console.log('App running on http://localhost:4242 (Ctrl + click to open)');
});
