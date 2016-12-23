import $ from 'jquery';

$(function() {

  $.getJSON('/user_id', function(data) {

    var otherUser = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    var currentUser = data;
    var socket = io.connect({ query: `user=${currentUser}` });
    const $messageForm = $('.js-message-form');
    const $message = $('.js-message');
    const $chat = $('.chat');

    $messageForm.on('submit', (e) => {
      e.preventDefault();
      socket.emit('send message', { content: $message.val(), sender: currentUser, receiver: otherUser});
      $message.val('');
    });

    socket.on('new message', function(message) {
      $chat.append(
        `<div><b>${message.sender.firstName} ${message.sender.lastName}: </b> ${message.content}</div>`
      );
    });
  });
});