const express = require('express');
const login = require('./login');
const register = require('./register');
const home = require('./home');

const router = new express.Router();

router.use(home);
router.use(login);
router.use(register);

module.exports = router;
