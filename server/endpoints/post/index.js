/* global Promise */

const mongoose = require('mongoose');
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

      res.redirect('back');
    });
  });
});

router.post('/post/:post_id/comment', function(req, res) {
  const currentUser = req.user;

  Post.findById(req.params.post_id, (postError, post) => {
    if (postError) {
      res.send(postError);
      return;
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

router.post('/post/:id/like', function(req, res) {
  const currentUser = req.user;
  Post.findById(req.params.id, (postFindError, post) => {
    if (postFindError) {
      res.send(postFindError);
      return;
    }

    if (post.likes.indexOf(currentUser.id) === -1) {
      post.likes.push(currentUser);
      post.save((postSaveError) => {
        if (postSaveError) {
          res.send(postSaveError);
          return;
        }

        res.redirect('back');
      });
    } else {
      res.status(401);
      res.send();
      return;
    }
  });
});

router.post('/post/:id/unlike', function(req, res) {
  const currentUser = req.user;
  Post.findById(req.params.id, (postFindError, post) => {
    if (postFindError) {
      res.send(postFindError);
      return;
    }

    const userIndex = post.likes.indexOf(currentUser.id);

    if (userIndex !== -1) {
      post.likes.splice(userIndex, 1);
      post.save((postSaveError) => {
        if (postSaveError) {
          res.send(postSaveError);
          return;
        }

        res.redirect('back');
      });
    } else {
      res.status(401);
      res.send();
      return;
    }
  });
});

router.post('/post/:id/delete', function(req, res) {
  const currentUser = req.user;

  Post.findById(req.params.id, (err, post) => {
    if (err) {
      throw err;
    }
    if (currentUser.id.toString() === post.user.toString()) {
      const userIndex = currentUser.posts.indexOf(req.params.id);
      currentUser.posts.splice(userIndex, 1);

      const postComments = post.comments.map((id) => mongoose.Types.ObjectId(id));

      Comment.find({_id: {$in: postComments}}, function(commentFindError, comments) {

        const postRemove = post.remove();
        const userSave = currentUser.save();
        const commentsDelete = comments.map((comment) => comment.remove());

        Promise.all([postRemove, userSave, ...commentsDelete]).then(() => {
          res.redirect('back');
        }).catch(() => {
          res.status(500);
          res.send();
          return;
        });
      });
    }
  });
});


module.exports = router;
