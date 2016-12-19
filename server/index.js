const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('passport');
const morgan = require('morgan');
const socketio = require('socket.io');

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
      return date.toLocaleDateString();
    },
    isContact(user, currentUser) {
      return user.contacts.find((contact) => {
        return contact.id === currentUser.id;
      });
    },
    hasSentRequest(user, currentUser) {
      return user.requests.find((req) => {
        return req.id === currentUser.id;
      });
    },
    hasReceivedRequest(user, currentUser) {
      return currentUser.requests.find((req) => {
        return req.id === user.id;
      });
    },
    isEqual(o1, o2) {
      return o1 === o2;
    }
  }
});

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'server/views/');

// Write all calls in console
app.use(morgan('dev'));

// serve static files from /public folder
const pathToPublicFolder = path.resolve(__dirname, '../public');
app.use('/public', express.static(pathToPublicFolder));

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

// Add router
app.use(endpoints);  // always use just before starting server

// start listening on port 4242
const port = process.env.PORT || '4242';

const server = app.listen(port, function() {
  console.log(`App running on http://localhost:${port} (Ctrl + click to open)`);
});

// Socket.io configuration
const io = socketio.listen(server);

var userSockets = [];

var User = require('./models/user');
var Message = require('./models/message');

io.sockets.on('connection', function(socket) {
  socket.user = socket.handshake.query.user;
  userSockets.push(socket);

  socket.on('send message', function(message) {
    User.findById(message.sender, (err, sender) => {
      if(err) {
        throw err;
      }
      User.findById(message.receiver, (err, receiver) => {
        if(err) {
          throw err;
        }

        var newMessage = new Message();
        newMessage.content = message.content;
        newMessage.sender = sender;
        newMessage.receiver = receiver;
        newMessage.save((err) => {
          if(err) {
            throw err;
          }
          sender.messages.push(newMessage);
          sender.save();
          receiver.messages.push(newMessage);
          receiver.save();
          // FIX Provjera jesu li kontakti
          socket.emit('new message', newMessage);

          if(newMessage.content && newMessage.content.trim()) {
            for(var i = 0; i < userSockets.length; i++) {
              if(userSockets[i].user === newMessage.receiver.id) {
                userSockets[i].emit('new message', newMessage);
              }
            }
          }
        });
      });
    });
  });
});
