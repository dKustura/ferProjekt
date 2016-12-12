const express = require('express');
const Post = require('../../models/post');

const router = new express.Router();

router.post('/unlike/:id', function(req, res) {
  const currentUser = req.user;
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      throw err;
    }

		var index = post.likes.indexOf(req.user.id);

		if (index !== -1) {
			post.likes.splice(index, 1);
			post.save((err) => {
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