const Post = require('../../../models/post');
const User = require('../../../models/user');

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
				req.user.posts.push(newPost);
				req.user.save((err) => {
					if(err) {
						console.log(err);
						res.send(err);
					} else {
						res.redirect('/home');
					}
				});
			}
		});
	}
}
