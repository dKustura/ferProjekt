const express = require('express');

const router = new express.Router();

router.get('/user_id', function(req, res) {
  res.json(req.user.id);
});

module.exports = router;
