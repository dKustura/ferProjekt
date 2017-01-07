import $ from 'jquery';

$(function() {

  const $chat = $('.chat');
  $chat.get(0).scrollTop = $chat.get(0).scrollHeight;

  $.getJSON('/user_id', function(data) {

    const otherUser = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    const currentUser = data;
    const socket = io.connect({query: `user=${currentUser}`});
    const $messageForm = $('.js-message-form');
    const $message = $('.js-message');

    $messageForm.on('submit', (e) => {
      e.preventDefault();
      socket.emit('send message', {content: $message.val(), sender: currentUser, receiver: otherUser});
      $message.val('');
      $chat.get(0).scrollTop = $chat.get(0).scrollHeight;
    });

    socket.on('new message', function(message) {
      $chat.append(
        `<div><b>${message.sender.firstName} ${message.sender.lastName}: </b> ${message.content}</div>`
      );

      $chat.get(0).scrollTop = $chat.get(0).scrollHeight;
    });
  });
});
