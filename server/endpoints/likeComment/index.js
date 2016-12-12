const express = require('express');
const Comment = require('../../models/comment');

const router = new express.Router();

router.post('/likeComment/:id', function(req, res) {
  const currentUser = req.user;

	Comment.findById(req.params.id, (err,comment) => {
		if (comment.likes.indexOf(currentUser.id) === -1) {
			comment.likes.push(currentUser);
			comment.save((err) => {
				if(err) {
					res.send(err);
					return;
				}
			})
		}

		res.redirect('back');
	});		
});

module.exports = router;