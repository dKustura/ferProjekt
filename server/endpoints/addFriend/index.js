const express = require('express');
const User = require('../../models/user');

const router = new express.Router();


router.get('/add-profile/:id', function(req, res) {
  const currentUser = req.user;
  
  User.findById(req.params.id, (err,user) => {
  
  var index = user.contacts.indexOf(currentUser);
		
		
		if (index == -1) {
			currentUser.contacts.push(user);
			user.contacts.push(currentUser);
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

		res.redirect('/');
	});		
});

module.exports = router;