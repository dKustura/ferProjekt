const express = require('express');

const router = new express.Router();

router.get('/login', function(req, res) {

  // this will render login template in /server/views
  res.render('login');
});

router.post('/login', function(req, res) {
  passport.authenticate('local-login', (error, user, info) => {
    if (error) {
      res.status(401);
      res.send(error);
      return;
    }

    if (!user) {
      res.status(404);
      res.send(info);
      return;
    }

    res.status(200);
    res.send(user);
  })(req, res);
});

module.exports = router;
