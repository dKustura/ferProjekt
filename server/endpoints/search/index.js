const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/search', function(req, res, next) {
  const currentUser = req.user;
  currentUser.getMessagesSeparated().then((result) => {
    req.currentUserMessages = result;
    next();
  });
}, function(req, res) {
  const currentUser = req.user;
  const query = req.query.query;

  User.find({
    $text: {$search: query}
  }).deepPopulate('profilePhoto')
  .exec((err, users) => {
    if (err) {
      throw err;
    }
    res.render('search', {users, fields: {query}, currentUser, newMessages: req.currentUserMessages.newMessages});
  });
});

module.exports = router;
