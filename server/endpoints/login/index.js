const express = require('express');
const passport = require('passport');

const router = new express.Router();

// GET

router.get('/login', function(req, res) {
  res.render('login');
});

// POST

function showLoginFormError(req, res, error) {
  res.status(401);
  res.render('login', {
    errors: [error],
    fields: {
      email: req.body.email
    }
  });
}

router.post('/login', function(req, res) {
  passport.authenticate('local-login', (error, user, info) => {
    console.log(error, user, info);
    if (error) {
      showLoginFormError(req, res, error);
      return;
    }

    if (!user) {
      showLoginFormError(req, res, info);
      return;
    }

    res.status(200);
    res.redirect('/');
  })(req, res);
});

module.exports = router;
