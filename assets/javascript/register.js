$(function(){

  const $registerForm = $('.js-register-form');

  $registerForm.live('submit', (e) => {
		e.preventDefault();

		const email = $registerForm.find('.js-email').val();
		const password = $registerForm.find('.js-password').val();
		const firstName = $registerForm.find('.js-first-name').val();
		const lastName = $registerForm.find('.js-last-name').val();
		const dateOfBirth = $registerForm.find('.js-date-of-birth').val();

		
		$.ajax({
			type: 'POST',
			url: '/register',
			dataType: 'json',
			data: {
				email,
				password,
				firstName,
				lastName,
				dateOfBirth
			},
			success: function(data){
				if(data.errors || data.message){
					window.location.replace('/register');
				}else{
					window.location.replace('/login');
			}}
		})
	});
});
