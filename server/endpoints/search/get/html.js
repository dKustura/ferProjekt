const User = require('../../../models/user');

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt){
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
}

module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  if(!req.user) {
    // redirects user that is not logged-in to login page
    res.redirect('/login');
  } else {
    // this will render home template in /server/views
    var names = req.query.query.trim().split(/\s+/);
    var firstName = names[0].toTitleCase();
    if(names[1]) var lastName = names[1].toTitleCase();

    // FIX
    User.find(
      {
        $or: [{lastName: firstName}, {firstName: lastName}],
        $or: [{firstName: firstName}, {lastName: lastName}]
      }).exec((err, users) => {
        if(err) throw err;
        res.render('search', {users: users});
    });
  }
}