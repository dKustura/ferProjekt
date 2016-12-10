const express = require('express');
const passport = require('passport');

const router = new express.Router();

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  passport.authenticate('local-register', (error, user, info) => {
    if (error) {
      res.status(401);
      res.send(error);
      return;
    }

    if (!user) {
      res.status(404);
      res.send(info);
      return;
    }

    res.status(200);
    res.send(user);
  })(req, res);
});

module.exports = router;
