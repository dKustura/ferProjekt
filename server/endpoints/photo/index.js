const express = require('express');
const Photo = require('../../models/photo');
const User = require('../../models/user');
const uploadDirectory = require('../../config').uploadDirectory;

const router = new express.Router();

router.get('/photo/:photo_id', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id).deepPopulate([
  		'user',
  		'likes',
  		'comments',
      'photoAlbum'
    ]);
  const messages = currentUser.getMessagesSeparated();
  Promise.all([photo, messages]).then(([photo, messages]) => {
    const url = photo.url.substr(uploadDirectory.length - 1);
    currentUser.isAllowedToView(url).then((result) => {
      if(result) {
        res.render('photo', {photo, currentUser, newMessages: messages.newMessages});
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('photo/:photo_id/next', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id).deepPopulate([
  		'user',
  		'likes',
  		'comments',
      'photoAlbum.photos'
    ]);
  const messages = currentUser.getMessagesSeparated();
  Promise.all([photo, messages]).then(([photo, messages]) => {
    const url = photo.url.substr(uploadDirectory.length - 1);
    currentUser.isAllowedToView(url).then((result) => {
      if(result) {
        const photos = photo.photoAlbum.photos;
        const index = photos.indexOf(photo);
        if(index >= photos.length - 1) {
          res.redirect('back');
        } else {
          const nextPhoto = photos[index+1];
          res.render('photo', {photo: nextPhoto, currentUser, newMessages: messages.newMessages});
        }
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('photo/:photo_id/prev', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id).deepPopulate([
  		'user',
  		'likes',
  		'comments',
      'photoAlbum.photos'
    ]);
  const messages = currentUser.getMessagesSeparated();
  Promise.all([photo, messages]).then(([photo, messages]) => {
    const url = photo.url.substr(uploadDirectory.length - 1);
    currentUser.isAllowedToView(url).then((result) => {
      if(result) {
        const photos = photo.photoAlbum.photos;
        const index = photos.indexOf(photo);
        if(index <= 0) {
          res.redirect('back');
        } else {
          const prevPhoto = photos[index-1];
          res.render('photo', {photo: prevPhoto, currentUser, newMessages: messages.newMessages});
        }
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('/albums/:user_id', function(req, res) {
  const currentUser = req.user;
  const user = User.findById(req.params.user_id).deepPopulate([
      'photoAlbums'
    ]);
  const messages = currentUser.getMessagesSeparated();
  Promise.all([user, messages]).then(([user, messages]) => {
    if(areContacts(user,currentUser)) {
      res.render('albums', {currentUser, albums: user.photoAlbums, newMessages: messages.newMessages});
    }
  });
});

function areContacts(u1, u2) {
  return u1.contacts.find((contact) => {
    return contact.toString() === u2.id.toString();
  });
};

module.exports = router;