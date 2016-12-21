const express = require('express');
const User = require('../../models/user');
const Message = require('../../models/message');

const router = new express.Router();

var chatViewHandler = function(req, res) {
  const currentUser = req.user;
  
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
          messages.forEach((message) => {
            if(message.isSeen == false) {
              message.isSeen = new Boolean(true);
              message.save((err) => {
                if(err){ throw err };
              });
            }
          });
        });

        var msgs = [];
        for(var i = 0; i < user.messages.length; i++) {
          var message = user.messages[i];
          console.log(message.sender);
          if(message.sender.id == req.params.id || message.receiver == req.params.id) {
            msgs.push(message);
          }
        }
        user.getMessagesSeparated((result) => {
          res.render('chat', {currentUser: user, user: usr, messages: msgs, newMessages: result.newMessages});
        });
      }
    });
  });
};

router.get('/chat/:id', chatViewHandler)

router.post('/chat/:id', chatViewHandler);

router.get('/chat', function(req,res) {
  const currentUser = req.user;

  currentUser.getMessagesSeparated(function(result) {
    res.render('messages', {
      currentUser: result.user,
      newMessages: result.newMessages,
      oldMessages: result.oldMessages
    });
  });
});

module.exports = router;