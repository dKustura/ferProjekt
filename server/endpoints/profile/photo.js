const express = require('express');
const Photo = require('../../models/photo');
const User = require('../../models/user');

const router = new express.Router();

router.get('/profile/:profile_id/photo/:photo_id', function(req, res) {
  const photo = req.photo;
  const currentUser = req.user;
  Photo.findById(req.params.id)
  	.deepPopulate([
  		'user',
  		'url',
  		'likes',
  		'comments',
  		'createdAt',
  		'photoAlbum'
  		]).exec((err,user) => {
  		res.render('profile/photo', {photo: photo, currentUser: req.user});
    });
});

module.exports = router;