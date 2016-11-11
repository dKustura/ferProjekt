const express = require('express');
const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const home = require('./home');

const router = new express.Router();

router.use(home);
router.use(login);
router.use(register);
router.use(logout);

module.exports = router;
