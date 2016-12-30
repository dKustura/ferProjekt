const express = require('express');
const Photo = require('../../models/photo');
const User = require('../../models/user');

const router = new express.Router();

router.get('/photo/:photo_id', function(req, res) {
  const currentUser = req.user;
  Photo.findById(req.params.photo_id)
  	.deepPopulate([
  		'user',
  		'likes',
  		'comments',
  		]).exec((err,photo) => {
        res.render('photo', {photo: photo, currentUser: req.user});
    });
});

module.exports = router;