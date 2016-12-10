const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/search', function(req, res) {
  const search = req.query.query;

  User.find({
    $text: {$search: search}
  }).exec((err, users) => {
    if (err) {
      throw err;
    }
    res.render('search', {users});
  });
});

module.exports = router;
