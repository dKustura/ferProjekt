const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {

      const minPasswordLength = 6;
      if (password.length < minPasswordLength) {
        return done({
          message: `Password must be at least ${minPasswordLength} characters long`
        });
      }

      User.findOne({email}, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done({
            message: 'Email is already in use.'
          });
        }

        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.dateOfBirth = req.body.dateOfBirth;

        newUser.save((error) => {
          if (error) {
            return done(error);
          }
          return done(null, newUser);
        });
      });
    });
  }));


  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({email}).select('+password').exec((err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'Email was not found.'
        });
      }

      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }

      req.logIn(user, function(error) {
        if (error) {
          return done(error);
        }
        return done(null, user);
      });
    });
  }));
};
