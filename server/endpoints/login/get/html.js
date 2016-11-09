module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  // this will render login template in /server/views
  res.render('login');
}
