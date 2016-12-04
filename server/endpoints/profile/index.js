const express = require('express');

const getHtml = require('./get/html');

const router = new express.Router();

router.get('/profile/:id', function(req, res) {
    getHtml(req, res);
});

module.exports = router;