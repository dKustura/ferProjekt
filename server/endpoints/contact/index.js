/* global Promise */
const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/requests', function(req, res) {
  const currentUser = req.user;

  User.findById(currentUser.id)
    .deepPopulate('requests')
    .exec((err, user) => {
      res.render('requests', {currentUser: user, requests: user.requests});
    });
});

router.get('/contacts', function(req, res) {
  const currentUser = req.user;

  User.findById(currentUser.id)
    .deepPopulate('contacts')
    .exec((err, user) => {
      res.render('contacts', {currentUser: user, contacts: user.contacts});
    });
});

router.post('/contact/decline/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  const userIndex = currentUser.requests.indexOf(userId);

  if (userIndex !== -1) {
    currentUser.requests.splice(userId, 1);
    currentUser.save((err) => {
      if (err) {
        res.send(err);
        return;
      }

      res.redirect('back');
    });
  }
});

router.post('/contact/accept/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  const userIndex = currentUser.requests.indexOf(userId);

  if (userIndex !== -1) {
    User.findById(userId, (err, user) => {

      currentUser.requests.splice(userId, 1);
      currentUser.contacts.push(userId);

      const currentUserSave = currentUser.save();

      user.contacts.push(currentUser);
      const userSave = user.save();

      Promise.all([currentUserSave, userSave]).then(() => {
        res.redirect('back');
      });
    });
  }
});

router.post('/contact/remove/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  const currentUserIndex = currentUser.contacts.indexOf(userId);

  if (currentUserIndex !== -1) {
    User.findById(userId, (err, user) => {
      if (err) {
        throw err;
      }
      const userIndex = user.contacts.indexOf(currentUser.id);

      user.contacts.splice(userIndex, 1);
      currentUser.contacts.splice(currentUserIndex, 1);

      const currentUserSave = currentUser.save();
      const userSave = user.save();

      Promise.all([currentUserSave, userSave]).then(() => {
        res.redirect('back');
      });
    });
  }
});

router.post('/contact/request/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      throw err;
    }

    const index = currentUser.contacts.indexOf(userId);

    // if the user isn't a contact and is not current user
    if (index === -1 && userId !== currentUser.id) {

      // send a contact request
      const reqIndex = user.requests.indexOf(currentUser.id);

      if (reqIndex === -1) {
        user.requests.push(currentUser.id);

      // otherwise cancel contact request
      } else {
        user.requests.splice(reqIndex, 1);
      }

      user.save((userSaveError) => {
        if (userSaveError) {
          res.send(err);
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

module.exports = router;
