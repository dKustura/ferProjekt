const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/search', function(req, res) {
  const query = req.query.query;

  if (query) {
    User.find({
      $text: {$search: query}
    }).exec((err, users) => {
      if (err) {
        throw err;
      }
      res.render('search', {users, fields: {query}});
    });
  } else {
    res.render('search', {fields: {query}});
  }
});

module.exports = router;
