const express = require('express');
const Post = require('../../models/post');

const router = new express.Router();

router.post('/post', function(req, res) {
  const currentUser = req.user;

  const newPost = new Post();
  newPost.user = currentUser;
  newPost.content = req.body.content;

  newPost.save((error) => {
    if (error) {
      res.send(error);
      return;
    }
    req.user.posts.push(newPost);
    req.user.save((err) => {
      if (err) {
        res.send(err);
        return;
      }

      res.redirect('/');
    });
  });
});

module.exports = router;
