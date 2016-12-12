const express = require('express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');

const router = new express.Router();

router.post('/comment/:id', function(req, res) {
  const currentUser = req.user;

  Post.findById(req.params.id, (err, post) => {
    if (err) {
      throw err;
    }
	
    const newComment = new Comment();
    newComment.user = currentUser;
    newComment.content = req.body.content;
		newComment.post = post;

    newComment.save((error) => {
			if (error) {
				res.send(error);
				return;
			}
			
			post.comments.push(newComment);
			post.save((err) => {
				if (err) {
					res.send(err);
					return;
				}

      	res.redirect('back');
    	});
		});
	});
});

module.exports = router;