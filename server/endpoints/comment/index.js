const express = require('express');
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const Photo = require('../../models/photo');

const router = new express.Router();

router.post('/comment/:id/delete', function(req, res) {
  const currentUser = req.user;

  Comment.findById(req.params.id, (commentFindError, comment) => {
    if (commentFindError) {
      throw commentFindError;
    }

    if (comment.user.toString() !== currentUser.id.toString()) {
      res.status(403);
      res.send();
      return;
    }

    // if comment is posted on a post
    if(comment.post) {
      Post.findById(comment.post, (PostFindError, post) => {
        if (PostFindError) {
          throw PostFindError;
        }

        const indexOfComment = post.comments.indexOf(req.params.id);
        post.comments.splice(indexOfComment, 1);

        post.save((err) => {
          if (err) {
            res.send(err);
            return;
          }
        });

        res.redirect('back');
      });
    // else - comment is posted on a photo
    } else {
      Photo.findById(comment.photo, (PhotoFindError, photo) => {
        if (PhotoFindError) {
          throw PhotoFindError;
        }

        const indexOfComment = photo.comments.indexOf(req.params.id);
        photo.comments.splice(indexOfComment, 1);

        photo.save((err) => {
          if (err) {
            res.send(err);
            return;
          }
        });
      });
    }
  });
});

router.post('/comment/:id/like', function(req, res) {
  const currentUser = req.user;

  Comment.findById(req.params.id, (err, comment) => {
    if (comment.likes.indexOf(currentUser.id) === -1) {
      comment.likes.push(currentUser);
      comment.save((commentSaveError) => {
        if (commentSaveError) {
          res.send(commentSaveError);
          return;
        }
      });
    } else {
      res.status(401);
      res.send();
      return;
    }

    res.redirect('back');
  });
});

router.post('/comment/:id/unlike', function(req, res) {
  const currentUser = req.user;

  Comment.findById(req.params.id, (err, comment) => {
    const userIndex = comment.likes.indexOf(currentUser.id);

    if (userIndex !== -1) {
      comment.likes.splice(userIndex, 1);
      comment.save((commentSaveError) => {
        if (commentSaveError) {
          res.send(commentSaveError);
          return;
        }
      });
    } else {
      res.status(401);
      res.send();
      return;
    }

    res.redirect('back');
  });
});



module.exports = router;
