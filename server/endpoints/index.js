const express = require('express');
const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const home = require('./home');
const search = require('./search');
const profile = require('./profile');
const post = require('./post');
const contact = require('./contact');
const chat = require('./chat');
const userData = require('./user-data');
const upload = require('./upload');
const comment = require('./comment');
const edit = require('./edit');

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
router.use(isAuthenticated, home);
router.use(isAuthenticated, search);
router.use(isAuthenticated, profile);
router.use(isAuthenticated, post);
router.use(isAuthenticated, contact);
router.use(isAuthenticated, chat);
router.use(isAuthenticated, userData);
router.use(isAuthenticated, upload);
router.use(isAuthenticated, comment);
router.use(isAuthenticated, edit);

module.exports = router;
