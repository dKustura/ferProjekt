const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/profile/:id', function(req, res) {
  const currentUser = req.user;
  User.findById(req.params.id).deepPopulate([
    'posts',
    'requests',
    'contacts',
    ]).exec((err, user) => {
    if (err) {
      throw err;
    }
    currentUser.deepPopulate([
      'messages',
      'requests'
    ], (err, currentUser) => {
      if (err) {
        throw err;
      }
      res.render('profile', {user, currentUser});
    });
  });
});

module.exports = router;
