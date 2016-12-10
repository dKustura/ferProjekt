const express = require('express');
const login = require('./login');
const register = require('./register');
const home = require('./home');

const router = new express.Router();

function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
    res.end();
  }
}

router.use(isAuthenticated, home);
router.use(login);
router.use(register);

module.exports = router;
