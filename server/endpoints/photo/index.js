/* global Promise */

const express = require('express');
const Photo = require('../../models/photo');
const User = require('../../models/user');
const Album = require('../../models/album');
const Comment = require('../../models/comment');
const uploadDirectory = require('../../config').uploadDirectory;

const router = new express.Router();

function areContacts(u1, u2) {
  return !!u1.contacts.find((contact) => contact.toString() === u2.id.toString());
}

router.get('/photo/:photo_id', function(req, res) {
  const currentUser = req.user;
  const photoPromise = Photo.findById(req.params.photo_id).deepPopulate([
    'user',
    'likes',
    'comments',
    'photoAlbum.photos'
  ]);
  const messagesPromise = currentUser.getMessagesSeparated();
  Promise.all([photoPromise, messagesPromise]).then(([photo, messages]) => {
    const url = photo.url.substr(uploadDirectory.length - 1);
    currentUser.isAllowedToView(url).then((result) => {
      if (result) {
        res.render('photo', {photo, currentUser, newMessages: messages.newMessages});
      } else {
        res.redirect('back');
      }
    });
  });
});

router.get('/photo/:photo_id/next', function(req, res) {
  const currentUser = req.user;
  Photo.findById(req.params.photo_id)
    .deepPopulate('photoAlbum.photos')
    .then((photo) => {
      const url = photo.url.substr(uploadDirectory.length - 1);
      currentUser.isAllowedToView(url).then((result) => {
        if (result) {
          const photos = photo.photoAlbum.photos;
          const index = photos.findIndex((p) => photo.id === p.id);
          if (index >= photos.length - 1) {
            res.redirect('back');
          } else {
            const nextPhotoId = photos[index + 1].id;
            res.redirect(`/photo/${nextPhotoId}`);
          }
        } else {
          res.redirect('back');
        }
      });
    });
});

router.get('/photo/:photo_id/prev', function(req, res) {
  const currentUser = req.user;
  Photo.findById(req.params.photo_id)
    .deepPopulate('photoAlbum.photos')
    .then((photo) => {
      const url = photo.url.substr(uploadDirectory.length - 1);
      currentUser.isAllowedToView(url).then((result) => {
        if (result) {
          const photos = photo.photoAlbum.photos;
          const index = photos.findIndex((p) => {
            return photo.id === p.id;
          });
          if (index <= 0) {
            res.redirect('back');
          } else {
            const prevPhotoId = photos[index - 1].id;
            res.redirect(`/photo/${prevPhotoId}`);
          }
        } else {
          res.redirect('back');
        }
      });
    });
});

router.get('/albums/list/:user_id', function(req, res) {
  const currentUser = req.user;
  const userPromise = User.findById(req.params.user_id).deepPopulate(['photoAlbums']);
  const messagesPromise = currentUser.getMessagesSeparated();
  Promise.all([userPromise, messagesPromise]).then(([user, messages]) => {
    if (areContacts(user, currentUser) || user.id === currentUser.id) {
      res.render('albums', {currentUser, user, albums: user.photoAlbums, newMessages: messages.newMessages});
    } else {
      res.render('back');
    }
  });
});

router.get('/albums/new', function(req, res) {
  const currentUser = req.user;
  const photosPromise = Photo.find({user: currentUser, photoAlbum: undefined});
  const messagesPromise = currentUser.getMessagesSeparated();
  Promise.all([photosPromise, messagesPromise]).then(([photos, messages]) => {
    res.render('album-new', {currentUser, photos, newMessages: messages.newMessages});
  });
});

router.post('/albums/new', function(req, res) {
  const currentUser = req.user;
  const photos = [].concat(req.body.photos);

  const newAlbum = new Album();
  newAlbum.user = currentUser;
  newAlbum.title = req.body.title;
  newAlbum.description = req.body.description;
  newAlbum.photos = photos;
  newAlbum.save().then((album) => {
    currentUser.photoAlbums.push(album);
    return currentUser.save();
  }).then(() => {
    const photosPromises = photos.map((id) => {
      return Photo.findById(id).then((photo) => {
        photo.photoAlbum = newAlbum;
        return photo.save();
      });
    });

    return Promise.all(photosPromises);
  }).then(() => {
    res.redirect(`/albums/list/${currentUser.id}`);
  });
});

router.get('/albums/view/:album_id', function(req, res) {
  const currentUser = req.user;
  const albumPromise = Album.findById(req.params.album_id).deepPopulate(['photos', 'user']);
  const messagesPromise = currentUser.getMessagesSeparated();

  Promise.all([albumPromise, messagesPromise]).then(([album, messages]) => {
    if (areContacts(currentUser, album.user) || album.user.id === currentUser.id) {
      res.render('album', {currentUser, album, newMessages: messages.newMessages});
    } else {
      res.redirect('back');
    }
  });
});

router.post('/albums/remove/photo/:photo_id', function(req, res) {
  Photo.findById(req.params.photo_id).deepPopulate('photoAlbum')
    .then((photo) => {
      if (photo.photoAlbum) {
        const albumId = photo.photoAlbum;
        photo.photoAlbum = undefined;
        photo.save();

        Album.findById(albumId, (err, album) => {
          album.photos.splice(album.photos.findIndex((p) => photo.id == p), 1);
          album.save().then(() => {
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
  const userPromise = currentUser.deepPopulate('photos');
  const messagesPromise = currentUser.getMessagesSeparated();

  Promise.all([userPromise, messagesPromise]).then(([user, messages]) => {
    res.render('photos', {currentUser, photos: user.photos, newMessages: messages.newMessages});
  });
});

router.post('/profile-photo', function(req, res) {
  const currentUser = req.user;
  if (!req.body.profile_photo) {
    res.redirect('back');
    return;
  }

  Photo.findById(req.body.profile_photo).then((photo) => {
    if (photo.user.toString() === currentUser.id.toString()) {
      currentUser.profilePhoto = photo;
      currentUser.save().then(() => {
        res.redirect(`/profile/${currentUser.id}`);
      });
    } else {
      res.redirect('back');
    }
  });
});

router.post('/profile-photo/:photo_id', function(req, res) {
  const currentUser = req.user;
  Photo.findById(req.params.photo_id).then((photo) => {
    if (photo.user.toString() === currentUser.id.toString()) {
      currentUser.profilePhoto = photo;
      currentUser.save().then(() => {
        res.redirect('back');
      });
    } else {
      res.redirect('back');
    }
  });
});

router.get('/albums/edit/:album_id', function(req, res) {
  const currentUser = req.user;
  const albumPromise = Album.findById(req.params.album_id).deepPopulate('photos');
  const photosPromise = Photo.find({user: currentUser, photoAlbum: undefined});
  const messagesPromise = currentUser.getMessagesSeparated();

  Promise.all([albumPromise, photosPromise, messagesPromise]).then(([album, photos, messages]) => {
    if (album.user.toString() !== currentUser.id.toString()) {
      res.redirect('back');
    } else {
      res.render('album-edit', {currentUser, album, photos, newMessages: messages.newMessages});
    }
  });
});

router.post('/albums/edit/:album_id/add', function(req, res) {
  const currentUser = req.user;
  const photoIds = [].concat(req.body.photos);
  Album.findById(req.params.album_id).then((album) => {
    if (album.user.toString() === currentUser.id.toString()) {
      const photosPromises = photoIds.filter((photoId) => !album.photos.includes(photoId))
      .map((photoId) => Photo.findById(photoId));

      Promise.all(photosPromises).then((photos) => {
        const editedPhotosPromises = photos.map((photo) => {
          if (photo.user.toString() === currentUser.id.toString()) {
            album.photos.push(photo);
            photo.photoAlbum = album;
            return photo.save();
          }
          return Promise.resolve();
        });

        Promise.all(editedPhotosPromises.concat(album.save())).then(() => {
          res.redirect('back');
        });
      });
    } else {
      res.redirect('back');
    }
  });
});

router.post('/albums/edit/:album_id/remove', function(req, res) {
  const currentUser = req.user;
  const photoIds = [].concat(req.body.photos);

  Album.findById(req.params.album_id).then((album) => {
    if (album.user.toString() === currentUser.id.toString()) {
      const photosPromises = photoIds.filter((photoId) => !album.photos.includes(photoId))
      .map((photoId) => Photo.findById(photoId));

      Promise.all(photosPromises).then((photos) => {
        const editedPhotosPromises = photos.map((photo) => {
          album.photos.splice(album.photos.findIndex((p) => {
            return p.toString() === photo.id.toString();
          }), 1);
          photo.photoAlbum = undefined;
          return photo.save();
        });

        Promise.all(editedPhotosPromises.concat(album.save())).then(() => {
          res.redirect('back');
        });
      });
    } else {
      res.redirect('back');
    }
  });
});

router.post('/albums/remove/:album_id', function(req, res) {
  const currentUser = req.user;

  Album.findById(req.params.album_id).then((album) => {
    if (album.user.toString() === currentUser.id.toString()) {
      const photosPromises = album.photos.map((photoId) => Photo.findById(photoId));

      Promise.all(photosPromises).then((photos) => {
        const editedPhotosPromises = photos.map((photo) => {
          photo.photoAlbum = undefined;
          return photo.save();
        });

        Promise.all(editedPhotosPromises.concat(album.remove())).then(() => {
          res.redirect(`/albums/list/${currentUser.id}`);
        });
      });
    } else {
      res.redirect('back');
    }
  });
});

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
