const express = require('express');
const User = require('../../models/user');
const Message = require('../../models/message');

const router = new express.Router();

router.get('/chat/:id', function(req, res) {
  const currentUser = req.user;
  if(req.params.id === currentUser.id) {
    res.redirect('/chat');
  } else {
    currentUser.deepPopulate([
      'messages',
      'messages.sender',
      ], (err, user) => {
      if (err) {
        throw err;
      }
      User.findById(req.params.id, (err, usr) => {
        if(!usr) {
          res.redirect('/chat');
        } else {
          Message.find({receiver: currentUser.id, sender: usr.id}, (err, messages) => {
            messages.filter((message) => {return !message.isSeen})
              .map((message) => {
                message.isSeen = true;
                message.save((err) => {
                  if(err) throw err;
                });
              });
          });

          const msgs = user.messages.filter((message) => {
            return message.sender.id == req.params.id || message.receiver == req.params.id
          });

          user.getMessagesSeparated().then((result) => {
            res.render('chat', {
              currentUser: user,
              user: usr,
              messages: msgs,
              newMessages: result.newMessages
            });
          });
        }
      });
    });
  }
});

router.get('/chat', function(req, res) {
  const currentUser = req.user;

  currentUser.getMessagesSeparated().then((result) => {
    res.render('messages', {
      currentUser: result.user,
      newMessages: result.newMessages,
      oldMessages: result.oldMessages
    });
  });
});

module.exports = router;