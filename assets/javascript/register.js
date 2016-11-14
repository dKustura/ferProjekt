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
