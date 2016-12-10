import $ from 'jquery';

$(function(){

  const $registerForm = $('.js-register-form');

	if(!$registerForm.length && window.location.pathname === '/register') {
		var delay = 2000; //redirection delay
		setTimeout(function(){
			window.location.replace('/home');
		}, delay);
	}

  $registerForm.on('submit', (e) => {
		e.preventDefault();

		const email = $registerForm.find('.js-email').val().toLowerCase();
		const password = $registerForm.find('.js-password').val();
		const firstName = $registerForm.find('.js-first-name').val().toTitleCase();
		const lastName = $registerForm.find('.js-last-name').val().toTitleCase();
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
		}).fail((error) => {
			var obj = error.responseJSON;
			$('.js-register-error').empty();
			if(obj.errors) {
				$.each(obj.errors, (key, value) => {
					$(`.js-register-${key}-error`).text(value.message);
				});
			} else {
				$('.js-register-missing-error').text(obj.message);
			}
		});
	});
});
