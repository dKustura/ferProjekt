const express = require('express');
const User = require('../../models/user');
require('../../models/post');

const router = new express.Router();

router.get('/profile/:id', function(req, res) {
  User.findById(req.params.id).deepPopulate('posts').exec((err, user) => {
    if (err) {
      throw err;
    }
    res.render('profile', {user});
  });
});

module.exports = router;
