const express = require('express');
const Comment = require('../../models/comment');
const Post = require('../../models/post');

const router = new express.Router();

router.post('/deleteComment/:id', function(req, res) {
  const currentUser = req.user;
  
	Comment.findById(req.params.id, (err,comment) => {
    if (err) {
      throw err;
    }
    
    Post.findById(comment.post, (err, post) => {
      if (err) {
        throw err;
      }

      if (comment.user == currentUser.id) {
        var index = post.comments.indexOf(req.params.id);
        post.comments.splice(index);

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
});

module.exports = router;