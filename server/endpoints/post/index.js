const express = require('express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');

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

router.post('/post/:post_id/comment', function(req, res) {
  const currentUser = req.user;

  Post.findById(req.params.post_id, (postError, post) => {
    if (postError) {
      throw postError;
    }

    const newComment = new Comment();
    newComment.user = currentUser;
    newComment.content = req.body.content;
    newComment.post = post;

    newComment.save((commentError) => {
      if (commentError) {
        res.send(commentError);
        return;
      }

      post.comments.push(newComment);
      post.save((postSaveError) => {
        if (postSaveError) {
          res.send(postSaveError);
          return;
        }

        res.redirect('back');
      });
    });
  });
});

module.exports = router;
