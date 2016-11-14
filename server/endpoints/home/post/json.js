const Post = require('../../../models/post');

module.exports = function(req, res) {
	res.setHeader('Content-Type', 'text/html');

	if(req.user) {
		const newPost = new Post();
		newPost.user = req.user;
		newPost.content = req.body.postContent;

		newPost.save((error) => {
			if(error) {
				console.log(error);
				res.send(error);
			} else {
				res.render('home', {user: req.user});
			}
		});
	}
}
