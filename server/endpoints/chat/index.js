const express = require('express');
const User = require('../../models/user');
const Message = require('../../models/message');

const router = new express.Router();

router.get('/chat/:id', function(req, res, next) {
  const currentUser = req.user;
  if (req.params.id === currentUser.id) {
    res.redirect('/chat');
  } else {
    next();
  }
}, function(req, res) {
  const currentUser = req.user;
  currentUser.deepPopulate([
    'messages',
    'messages.sender',
  ]).then((sender) => {
    User.findById(req.params.id).then((receiver) => {
      if (!receiver) {
        res.redirect('/chat');
        return;
      }

      Message.update({
        receiver: currentUser.id,
        sender: receiver.id,
        isSeen: false
      }, {
        isSeen: true
      }, {
        multi: true
      }).then(() => {
        const msgs = sender.messages.filter((message) => {
          return message.sender.id === req.params.id || message.receiver.toString() === req.params.id;
        });

        sender.getMessagesSeparated().then((result) => {
          res.render('chat', {
            currentUser: sender,
            user: receiver,
            messages: msgs,
            newMessages: result.newMessages
          });
        });
      });
    });
  });
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
