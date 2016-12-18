const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/profile/:id', function(req, res) {
  const currentUser = req.user;
  User.findById(req.params.id).deepPopulate('posts').exec((err, user) => {
    if (err) {
      throw err;
    }
    res.render('profile', {user, currentUser});
  });
});

module.exports = router;