$(function() {
	
	const $loginForm = $('.js-login-form');

	$loginForm.live('submit', (e) => {
		e.preventDefault(); 
		
		const email = $loginForm.find('.js-email').val();
		const password = $loginForm.find('.js-password').val();
		
		$.ajax({
			type: 'POST',
			url: '/login',
			dataType: 'json',
			data: {
				email,
				password
			},
			success: function(data){
				if(data.error || data.message)
					window.location.replace('/login');
				else{
					window.location.replace('/home');
			}}
		});
	});
}); 