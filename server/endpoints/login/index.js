const express = require('express');
const accepts = require('accepts');

const getHtml = require('./get/html');
const getJson = require('./get/json');

const router = new express.Router();

router.get('/login', function(req, res) {
  const accept = accepts(req);
  switch(accept.type(['json', 'html'])) {
  case 'json':
    getJson(req, res);
    break
  default:
    getHtml(req, res);
    break
  }
});

module.exports = router;
