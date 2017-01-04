/* global Promise */
const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/requests', function(req, res) {
  const currentUser = req.user;

  currentUser.deepPopulate('requests', (err, user) => {
    user.getMessagesSeparated().then((result) => {
      res.render('requests', {
          currentUser: user,
          requests: user.requests,
          newMessages: result.newMessages
        });
    });
  });
});

router.get('/contacts', function(req, res) {
  const currentUser = req.user;

  currentUser.deepPopulate([
    'contacts',
  ], (err, user) => {
    user.getMessagesSeparated().then((result) => {
      res.render('contacts', {
        currentUser: user,
        contacts: user.contacts,
        newMessages: result.newMessages
      });
    });
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
      res.redirect('back');
    }
  });
});

router.get('/contact/search', function(req, res) {
  const currentUser = req.user;
  const query = req.query.query;

  currentUser.getMessagesSeparated().then((result) => {
    if (query) {
      User.find({
        $text: {$search: query},
      }).exec((err, users) => {
        if (err) {
          throw err;
        }
        users = users.filter((user) => {
          return currentUser.contacts.find((contact) => {
              return contact.toString() === user.id.toString();
            });
        });
        res.render('search', {users, fields: {query}, currentUser, newMessages: result.newMessages});
      });
    } else {
      res.render('search', {fields: {query}, currentUser, newMessages: result.newMessages});
    }
  });
});

module.exports = router;
