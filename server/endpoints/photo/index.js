const express = require('express');
const Photo = require('../../models/photo');
const User = require('../../models/user');
const Album = require('../../models/album');
const uploadDirectory = require('../../config').uploadDirectory;

const router = new express.Router();

router.get('/photo/:photo_id', function(req, res) {
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
        res.render('photo', {photo, currentUser, newMessages: messages.newMessages});
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('/photo/:photo_id/next', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id)
    .deepPopulate('photoAlbum.photos');

  photo.then((photo) => {
    const url = photo.url.substr(uploadDirectory.length - 1);
    currentUser.isAllowedToView(url).then((result) => {
      if(result) {
        const photos = photo.photoAlbum.photos;
        const index = photos.findIndex((p) => {
          return photo.id === p.id;
        });
        if(index >= photos.length - 1) {
          res.redirect('back');
        } else {
          res.redirect(`/photo/${photos[index+1].id}`);
        }
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('/photo/:photo_id/prev', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id)
    .deepPopulate('photoAlbum.photos');

  photo.then((photo) => {
    const url = photo.url.substr(uploadDirectory.length - 1);
    currentUser.isAllowedToView(url).then((result) => {
      if(result) {
        const photos = photo.photoAlbum.photos;
        const index = photos.findIndex((p) => {
          return photo.id === p.id;
        });
        if(index <= 0) {
          res.redirect('back');
        } else {
          res.redirect(`/photo/${photos[index-1].id}`);
        }
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('/albums/list/:user_id', function(req, res) {
  const currentUser = req.user;
  const user = User.findById(req.params.user_id).deepPopulate([
      'photoAlbums'
    ]);
  const messages = currentUser.getMessagesSeparated();
  Promise.all([user, messages]).then(([user, messages]) => {
    if(areContacts(user,currentUser) || user.id === currentUser.id) {
      res.render('albums', {currentUser, user, albums: user.photoAlbums, newMessages: messages.newMessages});
    } else {
      res.render('back');
    }
  });
});

router.get('/albums/new', function(req, res) {
  const currentUser = req.user;
  const photos = Photo.find({user: currentUser, photoAlbum: undefined});
  const messages = currentUser.getMessagesSeparated();
  Promise.all([photos, messages]).then(([photos, messages]) => {
    res.render('album-new', {currentUser, photos: photos, newMessages: messages.newMessages});
  });
});

router.post('/albums/new', function(req, res) {
  const currentUser = req.user;
  
  const newAlbum = new Album();
  newAlbum.user = currentUser;
  newAlbum.title = req.body.title;
  newAlbum.description = req.body.description;
  newAlbum.photos = req.body.photos;
  newAlbum.save((err) => {
    if(err) {
      res.send(err);
      return;
    }
    currentUser.photoAlbums.push(newAlbum);
    currentUser.save();
  });

  req.body.photos.forEach((id) => {
    Photo.findById(id, (err, photo) => {
      if(err) {
        throw err;
      }
      photo.photoAlbum = newAlbum;
      photo.save(); 
    });
  });
  res.redirect('back');
});

router.get('/albums/view/:album_id', function(req, res) {
  const currentUser = req.user;
  const album = Album.findById(req.params.album_id).deepPopulate('photos');
  const messages = currentUser.getMessagesSeparated();

  Promise.all([album, messages]).then(([album, messages]) => {
    if(areContacts(currentUser, album.user) || album.user.toString() === currentUser.id.toString()) {
      res.render('album', {currentUser, album, newMessages: messages.newMessages});
    } else {
      res.redirect('back');
    }
  });
});

router.post('/albums/remove/:photo_id', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id).deepPopulate('photoAlbum');
 
  photo.then((photo) => {
    if(photo.photoAlbum) {
      albumId = photo.photoAlbum;
      photo.photoAlbum = undefined;
      photo.save();

      Album.findById(albumId, (err, album) => {
        album.photos.splice(album.photos.findIndex((p) => {
          return photo.id == p;
        }), 1);
        album.save((err) => {
          if(err) {
            throw err;
          }
          res.redirect('back');
        });
      });
    } else {
      res.redirect('back');
    }
  });
});

router.get('/profile-photo', function(req, res) {
  const currentUser = req.user;
  const user = currentUser.deepPopulate('photos');
  const messages = currentUser.getMessagesSeparated();

  Promise.all([user, messages]).then(([user, messages]) => {
    res.render('photos', {currentUser, photos: user.photos, newMessages: messages.newMessages});
  });
});

router.post('/profile-photo', function(req, res) {
  const currentUser = req.user;
  if(!req.body.profile_photo) {
    res.redirect('back');
  } else {
    const photo = Photo.findById(req.body.profile_photo);
    
    photo.then((photo) => {
      if(photo.user.toString() === currentUser.id.toString()) {
        currentUser.profilePhoto = photo;
        currentUser.save();
        
        res.redirect('back');
      } else {
        res.redirect('back');
      }
    });
  }
});

router.post('/profile-photo/:photo_id', function(req, res) {
  const currentUser = req.user;
  const photo = Photo.findById(req.params.photo_id);
  
  photo.then((photo) => {
    if(photo.user.toString() === currentUser.id.toString()) {
      currentUser.profilePhoto = photo;
      currentUser.save();
      
      res.redirect('back');
    } else {
      res.redirect('back');
    }
  });
});

function areContacts(u1, u2) {
  return u1.contacts.find((contact) => {
    return contact.toString() === u2.id.toString();
  }) !== undefined;
};

module.exports = router;