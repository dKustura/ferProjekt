module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  // this will render register template in /server/views
  res.render('register', {user: req.user});
}
