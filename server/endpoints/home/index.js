const express = require('express');

const router = new express.Router();

router.get('/', function(req, res) {
  const currentUser = req.user;
  currentUser.deepPopulate([
    'posts.user',
    'posts.likes',
    'posts.comments',
    'contacts.posts.user',
    'contacts.posts.likes',
    'contacts.posts.comments'
  ], (err, user) => {
    if (err) {
      throw err;
    }

    var posts = user.posts;
    user.contacts.forEach((contact) => {
      posts = posts.concat(contact.posts);
    });

    posts.sort((a, b) => {
      return b.postedAt - a.postedAt;
    });

    user.getMessagesSeparated(function(result) {
      res.render('home', {posts, currentUser: user, newMessages: result.newMessages});
    });
  });
});

module.exports = router;
