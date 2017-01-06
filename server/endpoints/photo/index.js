const express = require('express');
const Comment = require('../../models/comment');
const Photo = require('../../models/photo');

const router = new express.Router();

router.post('/photo/:id/like', function(req, res) {
  const currentUser = req.user;

  Photo.findById(req.params.id, (err, photo) => {
    if (photo.likes.indexOf(currentUser.id) === -1) {
      photo.likes.push(currentUser);
      photo.save((photoSaveError) => {
        if (photoSaveError) {
          res.send(photoSaveError);
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

router.post('/photo/:id/unlike', function(req, res) {
  const currentUser = req.user;

  Photo.findById(req.params.id, (err, photo) => {
    const userIndex = photo.likes.indexOf(currentUser.id);

    if (userIndex !== -1) {
      photo.likes.splice(userIndex, 1);
      photo.save((photoSaveError) => {
        if (photoSaveError) {
          res.send(photoSaveError);
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

router.post('/photo/:id/comment', function(req, res) {
  const currentUser = req.user;

  Photo.findById(req.params.id, (photoError, photo) => {
    if (photoError) {
      res.send(photoError);
      return;
    }

    const newComment = new Comment();
    newComment.user = currentUser;
    newComment.content = req.body.content;
    newComment.photo = photo;

    newComment.save((commentError) => {
      if (commentError) {
        res.send(commentError);
        return;
      }

      photo.comments.push(newComment);
      photo.save((photoSaveError) => {
        if (photoSaveError) {
          res.send(photoSaveError);
          return;
        }

        res.redirect('back');
      });
    });
  });
});

module.exports = router;
