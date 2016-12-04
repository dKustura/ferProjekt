const User = require('../../../models/user');

// bez ovog baca MissingSchema error za Comment ??
const Comment = require('../../../models/comment');

module.exports = function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  if(!req.user) {
    // redirects user that is not logged-in to login page
    res.redirect('/login');
  } else {
    // this will render home template in /server/views
    req.user.deepPopulate(['posts.user', 'posts.likes', 'posts.comments', 
      'contacts.posts.user', 'contacts.posts.likes', 'contacts.posts.comments'],
      (err, user) => {
        if(err) throw err;
        var posts = user.posts;
        user.contacts.forEach((contact) => {
          posts.concat(contact.posts);
        })
        posts.sort((a,b) => {
          return b.postedAt - a.postedAt;
        });
        res.render('home', {user: user, posts: posts});
      }
    );
  }
}
