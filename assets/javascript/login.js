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
			var obj = data.responseJSON;
			$('.js-login-error').empty();
			if(obj.error) {
				$(`.js-login-${obj.error.field}-error`).text(obj.error.message);
			} else {
				$('.js-login-missing-error').text(obj.message);
			}
		});
	});
}); 