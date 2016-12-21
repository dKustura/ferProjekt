const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/requests', function(req, res) {
  const currentUser = req.user;

  currentUser.deepPopulate('requests', (err, user) => {
    user.getMessagesSeparated(function(result) {
      res.render('requests', {
          currentUser: user,
          requests: user.requests,
          newMessages: result.newMessages
        });
    });
  });;
});

router.get('/contacts', function(req, res) {
  const currentUser = req.user;

  currentUser.deepPopulate([
    'contacts',
  ], (err, user) => {
    user.getMessagesSeparated(function(result) {
      res.render('contacts', {
        currentUser: user,
        contacts: user.contacts,
        newMessages: result.newMessages
      });
    });
  });;
});

router.get('/contact/decline/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  var index = currentUser.requests.indexOf(userId);

  // Pitanje: treba li res.redirect biti u .save zbog asinkronog poziva
  // (ovdje i na ostalim mjestima)
  if(index !== -1) {
    currentUser.requests.splice(userId, 1);
    currentUser.save((err) => {
      if(err) {
        res.send(err);
        return;
      }
    });
  }
  res.redirect('back');
});

router.get('/contact/accept/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  var index = currentUser.requests.indexOf(userId);

  if(index !== -1) {
    currentUser.requests.splice(userId, 1);
    currentUser.contacts.push(userId);
    currentUser.save((err) => {
      if(err) {
        res.send(err);
        return;
      }
    });
    User.findById(userId, (err, user) => {
      if(err) {
        throw err;
      }
      user.contacts.push(currentUser);
      user.save((err) => {
        if(err) {
          res.send(err);
          return;
        }
      });
    });
  }
  res.redirect('back');
});

router.get('/contact/remove/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;

  var userIndex = currentUser.contacts.indexOf(userId);

  if(userIndex !== -1) {
    User.findById(userId, (err, user) => {
      if(err) {
        throw err;
      }
      var index = user.contacts.indexOf(currentUser.id);
      user.contacts.splice(index, 1);

      currentUser.contacts.splice(userIndex, 1);
      currentUser.save((err) => {
        if(err) {
          res.send(err);
          return;
        }
      });
      user.save((err) => {
        if(err) {
          res.send(err);
          return;
        };
      });
    });
  }
  res.redirect('back');
});

router.get('/contact/request/:id', function(req, res) {
  const currentUser = req.user;
  const userId = req.params.id;
  
  User.findById(userId, (err, user) => {
    if(err) {
      throw err;
    }

    var index = currentUser.contacts.indexOf(userId);

    // if the user isn't a contact and is not current user
    if(index === -1 && userId !== currentUser) {
      // send a contact request
      var reqIndex = user.requests.indexOf(currentUser.id);

      if(reqIndex === -1) {
        user.requests.push(currentUser.id);

      // otherwise cancel contact request
      } else {
        user.requests.splice(reqIndex, 1);
      }
    }
    user.save((err) => {
      if (err) {
        res.send(err);
        return;
      }
      res.redirect('back');
    });
  });
});

module.exports = router;