const express = require('express');
const passport = require('passport');

const router = new express.Router();

router.get('/profile/:id/edit', function(req, res) {
  const user = req.user;
  if(user.id == req.params.id){
    res.render('edit', {
      currentUser : user,
      fields: {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        dateOfBirth: req.user.dateOfBirth
      }
    });
  }
  else{
    res.redirect('/profile/' + req.params.id );
  }
});

function showEditFormError(req, res, error) {
  res.render('edit', {
    errors: error,
    currentUser : req.user,
    fields: {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth
    }
  });
}

router.post('/profile/:id/edit', function(req, res) {
  passport.authenticate('local-edit', (error, user, info) => {
    if (error) {
      res.status(500);
      showEditFormError(req, res, error);
      return;
    }

    if (!user) {
      res.status(404);
      showEditFormError(req, res, info);
      return;
    }

    res.status(200);
    res.redirect('/profile/' + req.params.id );
  })(req, res);
});

module.exports = router;
