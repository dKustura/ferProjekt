const express = require('express');
const path = require('path');
const config = require('./config');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const endpoints = require('./endpoints');

// Create new app
const app = express();

// Connect to database
const DB = `mongodb://${config.databaseUsername}:${config.databasePassword}@ds011664.mlab.com:11664/projektbaza`;
mongoose.connect(DB);

// Set view engine options
var hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: 'server/views/layouts/'
});

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'server/views/');

// serve static files from /public folder
const pathToPublicFolder = path.resolve(__dirname, '../public');
app.use('/public', express.static(pathToPublicFolder));

app.use(endpoints);

// start listening on port 4242
const port = process.env.PORT || '4242';
app.listen(port, function () {
  console.log(`App running on http://localhost:${port} (Ctrl + click to open)`);
});
