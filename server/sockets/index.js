const socketio = require('socket.io');
const User = require('../models/user');
const Message = require('../models/message');

module.exports.listen = function(app){
    io = socketio.listen(app);

    var userSockets = [];

    io.sockets.on('connection', function(socket) {
      socket.user = socket.handshake.query.user;
      userSockets.push(socket);

      socket.on('send message', function(message) {

        if(message.content.trim()) {
          const sender = User.findById(message.sender);
          const receiver = User.findById(message.receiver);
          Promise.all([sender, receiver]).then(([sender, receiver]) => { 
            var newMessage = new Message();
            newMessage.content = message.content;
            newMessage.sender = sender;
            newMessage.receiver = receiver;
            newMessage.save((err) => {
              if(err) {
                throw err;
              }
              sender.messages.push(newMessage);
              sender.save();
              receiver.messages.push(newMessage);
              receiver.save();
              socket.emit('new message', newMessage);

              userSockets.filter((socket) => {
                return socket.user === newMessage.receiver.id
              }).map((socket) => {
                socket.emit('new message', newMessage);
              });

              console.log('SENT ' + sender.id + ' ' + receiver.id);
              Message.update({
                receiver: sender.id,
                sender: receiver.id,
                isSeen: false
              }, {
                isSeen: true
              }, {
                multi: true
              }).catch(() => {
                res.status(500);
                res.send();
                return;
              });
            });
          });
        }
      });

      socket.on('disconnect', function() {
        userSockets.splice(userSockets.indexOf(socket), 1);
      });
    });

    return io;
}