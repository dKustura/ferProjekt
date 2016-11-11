import $ from 'jquery';

$(function() {
	
	const $loginForm = $('.js-login-form');

	$loginForm.on('submit', (e) => {
		e.preventDefault(); 
		
		const email = $loginForm.find('.js-email').val();
		const password = $loginForm.find('.js-password').val();

		$.post({
			url: '/login',
			dataType: 'json',
			data: {
				email,
				password
			}
		}).done(() => {
			window.location.replace('/home');
		}).fail((data) => {
			var error = data.responseJSON.error;
			$('.js-login-error').empty();
			if(error) {
				$(`.js-login-${error.field}-error`).text(error.message);
			} else {
				$('.js-login-missing-error').text(data.message);
			}
		});
	});
}); 