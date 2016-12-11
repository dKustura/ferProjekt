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

    const posts = user.posts;
    user.contacts.forEach((contact) => {
      posts.concat(contact.posts);
    });

    posts.sort((a, b) => {
      return b.postedAt - a.postedAt;
    });

    res.render('home', {posts, currentUser: user});
  });
});

module.exports = router;
