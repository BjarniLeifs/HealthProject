// userR.j

var User = require('../models/user');
var Blog = require('../models/blog');

module.exports = function(app, passport, mongoose) {

  //Blogs

  app.get('/api/blog/myblogs', function(req, res) {
    Blog.find({"userID" : req.user._id}, function(err, data){
      console.log(data);
      res.send(data);
    }).sort({date : 'desc'});
  });

  app.post('/api/blog', function(req, res) {
    var newBlog = new Blog();
    newBlog.title = req.body.title;
    newBlog.body = req.body.body;
    newBlog.author = req.user.local.name;
    newBlog.edited = false;
    newBlog.meta.votes = 0;
    newBlog.meta.favs = 0;
    newBlog.tags = req.body.tags;

    // save the blog
    newBlog.save(function(err) {
        if (err)
            throw err;
    });
  });

  app.put('/api/blog/meta/votes', function(req, res){
    Blog.findOne({_id : req.body._id}, function(err, data){
      data.meta.votes += 1;
      data.save(function(err) {
        if (err)
            throw err;
      });
    });
  });

  app.put('/api/blog/meta/favs', function(req, res){
    Blog.findOne({_id : req.body._id}, function(err, data){
      data.meta.favs += 1;
      data.save(function(err) {
        if (err)
            throw err;
      });
      //Update user side
    });
  });



  app.get('/api/blog', function(req, res) {
    Blog.find({}, function(err, data){
      console.log(data);
      res.send(data);
    }).sort({date : -1});
  });

  app.post('/api/blogByTags', function(req, res) {
    var blogs = [];
    Blog.find({}, function(err, data){
      for (var i = data.length - 1; i >= 0; i--) {
        var isSuperset = data.every(isSupersetF(val, req.body.tags));
        if(isSuperset)
          blogs.push(data[i]);
        isSuperset = false;
      }
      res.send(blogs);
    }).sort({title : 'desc'});
  });

  // Comments

  app.put('/api/blog/comment', function(req, res) {
    Blog.findOne({_id : req.body._id}, function(err, data){
      var newComment = {
        commenter : req.user.local.name,
        body: req.body.comment
      };
      console.log(newComment);
      data.comments.push(newComment);
      data.save(function(err) {
        if (err)
            throw err;
      });
    });
  });

};

function isSupersetF(val, reqTags) { 
  return reqTags.indexOf(val) >= 0; 
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/notLoggedIn');
}
