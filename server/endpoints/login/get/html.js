module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  if(req.user) {
    // redirects user that is already logged-in to homepage
    res.redirect('/home');
  } else {
    // this will render login template in /server/views
    res.render('login');
  }
}
