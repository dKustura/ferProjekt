const express = require('express');
const Post = require('../../models/post');

const router = new express.Router();

router.post('/like/:id', function(req, res) {
  const currentUser = req.user;
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      throw err;
    }

		if (post.likes.indexOf(req.user.id) === -1) {
			post.likes.push(req.user);
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
