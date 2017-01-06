const express = require('express');
const path = require('path');
const fs = require('rs');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('passport');
const morgan = require('morgan');
const socketio = require('./sockets');

const config = require('./config');
const endpoints = require('./endpoints');
require('./models');

// Create new app
const app = express();

// Connect to database
const DB = `mongodb://${config.databaseUsername}:${config.databasePassword}@ds011664.mlab.com:11664/projektbaza`;
mongoose.connect(DB);

const passportConfig = require('./config/passport');
const MongoStore = connectMongo(session);

// Set view engine options
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: 'server/views/layouts/',
  partialsDir: 'server/views/partials/',
  helpers: {
    formatDate(date) {
      let dateFormat;
      try {
        dateFormat = date.toLocaleDateString();
      } catch (e) {
        return date;
      }
      return dateFormat;
    },
    isContact(user, currentUser) {
      return user.contacts.find((contact) => {
        return contact == currentUser.id;
      });
    },
    hasSentRequest(user, currentUser) {
      return user.requests.find((req) => {
        return req == currentUser.id;
      });
    },
    hasReceivedRequest(user, currentUser) {
      return currentUser.requests.find((req) => {
        return req == user.id;
      });
    },
    isLiked(likes, user) {
      return !!likes.filter((like) => like.id === user.id).length;
    },
    eq(obj1, obj2) {
      return obj1 === obj2;
    },
    isAllowedToView(user, currentUser) {
      return user.id === currentUser.id || user.contacts.find((contact) => {
        return contact.toString() === currentUser.id.toString();
      });
    },
    hasNextPhoto(photo) {
      if(photo.photoAlbum) {
        const photos = photo.photoAlbum.photos;
        const index = photos.findIndex((p) => {
          return photo.id === p.id;
        });
        return index !== photos.length - 1;
      } else {
        return false;
      }
    },
    hasPrevPhoto(photo) {
      if(photo.photoAlbum) {
        const photos = photo.photoAlbum.photos;
        const index = photos.findIndex((p) => {
          return photo.id === p.id;
        });
        return index !== 0;
      } else {
        return false;
      }
    },
    isProfilePhoto(photo, user) {
      return photo.id.toString() === user.profilePhoto.toString();
    },
    hasAlbum(photo) {
      return photo.photoAlbum !== undefined;
    }
  }
});

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'server/views/');

// Write all calls in console
app.use(morgan('dev'));

// Module for parsing cookies
app.use(cookieParser());

// Module for parsing incoming request bodies (2 types)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Using session for logged-in user
app.use(session({
  secret: 'myUserSuperSecret',
  cookie: {
    maxAge: 2628000000
  },
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// Use passport for authentication at login and register
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use('/public/uploads', function(req, res, next) {
  // if user is not logged in or is not allowed to view the file - restrict view
  const currentUser = req.user;
  if (!currentUser) {
    res.redirect('/');
  } else {
    currentUser.isAllowedToView(req.path).then((result) => {
      if (result) {
        next();
      } else {
        res.redirect('back');
      }
    });
  }
});

// serve static files from /public folder
const pathToPublicFolder = path.resolve(__dirname, '../public');
app.use('/public', express.static(pathToPublicFolder));

if (!fs.existsSync(config.uploadDirectory)) {
  fs.mkdirSync(config.uploadDirectory);
}

// Add router
app.use(endpoints);  // always use just before starting server

// start listening on port 4242
const port = process.env.PORT || '4242';

const server = app.listen(port, function() {
  console.log(`App running on http://localhost:${port} (Ctrl + click to open)`);
});

// Socket.io configuration
const io = socketio.listen(server);
