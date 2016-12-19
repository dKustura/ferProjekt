const express = require('express');
const User = require('../../models/user');

const router = new express.Router();

router.get('/chat/:id', function(req, res) {
  const currentUser = req.user;
  currentUser.deepPopulate([
    'requests',
    'messages'
    ], (err, user) => {
    if (err) {
      throw err;
    }
    User.findById(req.params.id, (err, usr) => {
      if(!usr || user.contacts.indexOf(usr.id) === -1) {
        res.redirect('/contacts');
      } else {
        res.render('chat', {currentUser: user, user: usr});
      }
    });
  });
});

module.exports = router;