const express = require('express');
const path = require('path');
const config = require('./config');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('passport');
const endpoints = require('./endpoints');


// Create new app
const app = express();

// Connect to database
const DB = `mongodb://${config.databaseUsername}:${config.databasePassword}@ds011664.mlab.com:11664/projektbaza`;
mongoose.connect(DB);

const passportConfig = require('./config/passport');
const MongoStore = connectMongo(session);

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
 

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'myUserSuperSecret',
  cookie: {
    maxAge: 2628000000,
  },
	resave: true,
	saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
 
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);




app.use(endpoints);  // always use just before starting server



// start listening on port 4242
app.listen(4242, function () {
  console.log('App running on http://localhost:4242 (Ctrl + click to open)');
});