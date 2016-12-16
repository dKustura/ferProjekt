const express = require('express');
const User = require('../../models/user');

const router = new express.Router();


router.get('/add-profile/:id', function(req, res) {
  const currentUser = req.user;
  
  User.findById(req.params.id, (err,user) => {
  
  var index = currentUser.contacts.indexOf(user.id);
		
		
		if (index == -1) {
			currentUser.requests.push(user);
			user.pending.push(currentUser);
		    currentUser.save((err) => {
				if(err) {
					res.send(err);
					return;
				}
			})
			user.save((err) => {
				if(err) {
					res.send(err);
					return;
				}
			})
		}

	});		
});

module.exports = router;