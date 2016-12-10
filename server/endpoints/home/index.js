const express = require('express');

const getHtml = require('./get/html');
const postJson = require('./post/json');

const router = new express.Router();

router.get(['/home', '/'], function(req, res) {
    getHtml(req, res);
});

router.post(['/home', '/'], function(req, res) {
    postJson(req,res);
});

module.exports = router;