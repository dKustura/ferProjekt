import $ from 'jquery';

$(function(){
  const $registerForm = $('.js-register-form');

  $registerForm.on('submit', (e) => {
    e.preventDefault();

    const email = $registerForm.find('.js-email').val();
    const password = $registerForm.find('.js-password').val();
    const firstName = $registerForm.find('.js-first-name').val();
    const lastName = $registerForm.find('.js-last-name').val();
    const dateOfBirth = $registerForm.find('.js-date-of-birth').val();
		
    $.post({
      url: '/register',
      dataType: 'json',
      data: {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth
      }
	  }).done(() => {
      window.location.replace('/login');
    }).fail(() => {
      window.location.replace('/register');	
    });
  });
});
