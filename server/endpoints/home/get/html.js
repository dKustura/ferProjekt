module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  // this will render home template in /server/views
  res.render('home');  
}
