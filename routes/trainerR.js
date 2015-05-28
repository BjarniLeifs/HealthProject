// trainerR.j

var User = require('../models/user');

module.exports = function(app, passport, mongoose) {

  app.get('/api/trainers', function(req, res) {
    User.find({"isTrainer" : "true"}, function(err, data){
      res.send(data);
    });
  });

  app.put('/api/settrainer', function(req, res) {
    User.update({"_id" : req.user._id}, {"isTrainer" : "true"}, function(err){
      if(err)
        throw err;
      res.send(200, "Trainer set");
    });
  });

  app.post('/api/setcostumer', function(req, res) {
    User.findOne({"_id" : req.user._id}, function(err, data) {
      if(err)
        throw err;
      if(!data)
        console.log("No data");
      data.customers.push(req.body.userID);
      data.markModified('customers');
      data.save();
      res.send(200, "Customer saved");
    });
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/notLoggedIn');
}
