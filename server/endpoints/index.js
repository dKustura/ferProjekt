const express = require('express');
const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const home = require('./home');
const search = require('./search');
const profile = require('./profile');

const router = new express.Router();

router.use(home);
router.use(login);
router.use(register);
router.use(logout);
router.use(search);
router.use(profile);

module.exports = router;
