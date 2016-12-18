const express = require('express');
const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const home = require('./home');
const search = require('./search');
const profile = require('./profile');
const post = require('./post');
const upload = require('./upload');

const router = new express.Router();

function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
    res.end();
  }
}

router.use(register);
router.use(login);
router.use(logout);
router.use(upload);
router.use(isAuthenticated, home);
router.use(isAuthenticated, search);
router.use(isAuthenticated, profile);
router.use(isAuthenticated, post);
router.use(isAuthenticated, upload);

module.exports = router;
