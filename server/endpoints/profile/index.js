const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/profile/:id', function(req, res) {
  const currentUser = req.user;
  const messages = currentUser.getMessagesSeparated();
  const user = User.findById(req.params.id).deepPopulate([
    'posts',
    'posts.user',
    'posts.likes',
    'posts.comments.likes',
    'posts.comments.user',
    'photos',
    'profilePhoto'
  ]);
  Promise.all([messages, user]).then(([messages, user]) => {
    res.render('profile', {user, currentUser, newMessages: messages.newMessages});
  });
});

module.exports = router;
