const express = require('express');
const login = require('./login');

const router = new express.Router();

router.use(login);

module.exports = router;
