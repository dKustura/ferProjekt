const passport = require('passport');

module.exports = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	passport.authenticate('local-login', (error, user, info) => {
		
		res.status(401);
		if (error) {
			console.log(error);
			res.send(error);
			return;
		}
		
		if (!user) {
			console.log(info);
			res.send(info);
			return;
		}
		
		res.status(200);
		res.send(user);
	})(req, res);
}
