const express = require('express');
const accepts = require('accepts');

const getHtml = require('./get/html');

const router = new express.Router();

router.get('/logout', function(req, res) {
  const accept = accepts(req);
  if(accept.type('html')) {
    getHtml(req, res);
  }
});

module.exports = router;
