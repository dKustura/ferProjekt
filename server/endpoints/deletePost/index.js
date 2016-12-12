const express = require('express');
const Post = require('../../models/post');
const User = require('../../models/user');

const router = new express.Router();

router.post('/deletePost/:id', function(req, res) {
  const currentUser = req.user;
  
	Post.findById(req.params.id, (err,post) => {
    if (err) {
      throw err;
    }
    
    User.findById(post.user, (err, user) => {
      if (err) {
        throw err;
      }

      if (user.id === currentUser.id) {
        var index = user.posts.indexOf(req.params.id);
        user.posts.splice(index);

        user.save((err) => {
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