var socketio = require('socket.io');

module.exports.listen = function(app){
    io = socketio.listen(app);

    io.sockets.on('connection', function(socket) {
      socket.on('send message', function(data) {
        if(data && data.trim()) {
          io.sockets.emit('new message', data);
        }
      });
    });
    return io;
}