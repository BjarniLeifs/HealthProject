// userR.js

var User = require('../models/user');
var Profile = require('../models/profile');
var Messages = require('../models/messages');

module.exports = function(app, passport, mongoose) {

// Account 

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.sendfile(path.join(clientDir, 'index.html'));
  });

  // process the login form
  app.post('/api/login', passport.authenticate('local-login', {
    successRedirect : '/loginSuccess', // redirect to the secure profile section
    failureRedirect : '/loginFailure', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
 
  app.get('/loginFailure', function(req, res, next) {
    res.send('Failed to authenticate');
  });

  app.get('/loginSuccess', function(req, res, next) {
    res.send('Successfully authenticated');
  });

  // process the signup form
  app.post('/api/register', passport.authenticate('local-signup', {
    successRedirect : '/registerSuccess', // redirect to the secure profile section
    failureRedirect : '/registerFailure', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/registerSuccess', function(req, res, next) {
    var newProfile = new Profile();
    newProfile.userID = req.user._id;
    newProfile.email = req.user.local.email;
    newProfile.firstName = "";
    newProfile.lastName = "";
    newProfile.birthDay = new Date(Date.now());
    newProfile.height = 0;
    newProfile.weight = 0;
    console.log(newProfile);

    newProfile.save(function(err) {
      if (err)
          throw err;
    });

    res.send("User: " + req.body.name + " registered");
  });

  app.get('/api/userpublicinfo', function(req, res){
    User.find({}, function(err, data) {
      if(err)
        throw err;
      console.log(data);
      res.send(data);
    });
  });

  app.get('/api/userinfo', function(req, res) {
    if(req.user) {
      res.send(req.user);
    }
    else {
      res.send("Not logged in");
    }
  });

  app.get('/registerFailure', function(req, res, next) {
    res.send('Email Address already in use');
  });

  // LOGOUT
  app.get('/logout', function(req, res) {
    req.logout();
    res.send('Logged Out');
  });

  app.get('/ping', function(req, res) {
    console.log(req.user);
    res.send("Pong!");
  });


// Profile

  app.put('/api/profile/update', function(req, res) {
    Profile.findOne({"email" : req.user.local.email}, function(err, data) {
      if(err)
        throw err;

      // set profile variables
      var newProfile = data;
      newProfile.firstName = req.body.firstName;
      newProfile.lastName = req.body.lastName;
      newProfile.birthDay = req.body.birthDay;
      newProfile.height = req.body.height;
      newProfile.weight = req.body.weight;

      // save the user
      newProfile.save(function(err) {
          if (err)
              throw err;
      });
      console.log(data);
      res.send(200, "Profile updated");
    });
  });

  app.get('/api/profile/:name', function(req, res) {
    Profile.findOne({"userName" : req.params.name}, function(err, data) {
      if(err)
        throw err;


      var sendData = {
        "firstName" : data.firstName,
        "lastName"  : data.lastName,
        "birthDay"  : data.birthDay
      };
      res.send(sendData);
    });
  });

  app.get('/api/profile', function(req, res) {
    console.log("userid: " + req.user._id);
    Profile.findOne({"userID" : req.user._id}, function(err, data) {
      if(err)
        throw err;
      console.log("Profileid: " + data.userID);
      res.send(data);
    });
  });

  app.get('/api/messages', function(req, res) {
    Messages.find({"recID" : req.user._id}, function(err, data) {
      if(err)
        throw err;
      res.send(data);
    });
  });

  app.post('/api/messages', function(req, res) {
    var newMessage = new Messages();
    newMessage.senderID = req.user._id;
    newMessage.recID = req.body.recID;
    newMessage.senName = req.user.local.name;
    newMessage.title = req.body.title;
    newMessage.read = false;
    newMessage.message = req.body.message;
    newMessage.save(function(err) {
      if (err)
        throw err;
    });
  });

  app.put('/api/profile/ReadMessages', function(req, res) {
    Messages.findOne({"_id" : req.body.ID}, function(err, data) {
      if(err)
        throw err;

      var newMessage = new Messages();
      newMessage = data;  
      newMessage.read = true;

      // save the user
      newMessage.save(function(err) {
          if (err)
              throw err;
      });
    });
  });

  app.get('/api/isLoggedIn', isLoggedIn, function(req, res) {
    res.send(200);
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.send('Not Logged In');
}
