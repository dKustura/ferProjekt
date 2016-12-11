const express = require('express');
const passport = require('passport');

const router = new express.Router();

// GET

router.get('/register', function(req, res) {
  if (req.user) {
    res.redirect('/');
    res.end();
    return;
  }
  
  res.render('register');
});

// POST

function showRegisterFormError(req, res, error) {
  res.status(401);
  res.render('register', {
    errors: [error],
    fields: {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth
    }
  });
}

router.post('/register', function(req, res) {
  passport.authenticate('local-register', (error, user, info) => {
    if (error) {
      showRegisterFormError(req, res, error);
      return;
    }

    if (!user) {
      showRegisterFormError(req, res, info);
      return;
    }

    res.status(200);
    res.redirect('/login');
  })(req, res);
});

module.exports = router;
