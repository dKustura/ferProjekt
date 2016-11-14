module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  if(!req.user) {
    // redirects user that is not logged-in to login page
    res.redirect('/login');
  } else {
    // this will render home template in /server/views
    res.render('home', {user: req.user});
  }
}
