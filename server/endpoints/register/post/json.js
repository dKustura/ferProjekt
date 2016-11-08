const passport = require('passport');

module.exports = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	passport.authenticate('local-register', (error, user, info) => {
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
		res.send(user);
	})(req, res);
};

