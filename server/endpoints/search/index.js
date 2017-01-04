const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/search', function(req, res) {
  const currentUser = req.user;
  const query = req.query.query;

  currentUser.getMessagesSeparated().then((result) => {
    if (query) {
      User.find({
        $text: {$search: query}
      }).exec((err, users) => {
        if (err) {
          throw err;
        }
        res.render('search', {users, fields: {query}, currentUser, newMessages: result.newMessages});
      });
    } else {
      res.render('search', {fields: {query}, currentUser, newMessages: result.newMessages});
    }
  });
});

module.exports = router;
