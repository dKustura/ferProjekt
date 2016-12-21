const express = require('express');

const router = new express.Router();

router.get('/', function(req, res) {
  const currentUser = req.user;
  currentUser.deepPopulate([
    'posts.user',
    'posts.likes',
    'posts.comments.likes',
    'posts.comments.user',
    'contacts.posts.user',
    'contacts.posts.likes',
    'contacts.posts.comments.likes',
    'contacts.posts.comments.users'
  ], (err, user) => {
    if (err) {
      throw err;
    }

    let posts = user.posts;
    user.contacts.forEach((contact) => {
      posts = posts.concat(contact.posts);
    });

    posts.sort((a, b) => {
      return b.postedAt - a.postedAt;
    });

    res.render('home', {posts, currentUser: user});
  });
});

module.exports = router;
