const User = require('../../../models/user');

module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  if(!req.user) {
    // redirects user that is not logged-in to login page
    res.redirect('/login');
  } else {
    // this will render home template in /server/views
    User.findById(req.params.id).deepPopulate('posts').exec((err, user) => {
      if(err) throw err;
      res.render('profile', {user: user});
    });
  }
}
