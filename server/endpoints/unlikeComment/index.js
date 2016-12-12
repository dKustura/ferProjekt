const express = require('express');
const Comment = require('../../models/comment');

const router = new express.Router();

router.post('/unlikeComment/:id', function(req, res) {
  const currentUser = req.user;

	Comment.findById(req.params.id, (err,comment) => {
		var index = comment.likes.indexOf(currentUser.id);

		if (index !== -1) {
			comment.likes.splice(index);
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