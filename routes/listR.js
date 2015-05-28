// listR.j

var List = require('../models/list');
var Matis = require('../models/food');
var Recipe = require('../models/recipe');
var Calender = require('../models/calender');

module.exports = function(app, passport, mongoose) {

// Lists

  app.post('/api/list/:type', function(req, res) {
    List.findOne({"userID" : req.user._id}, function(err, data) {
      if(err)
        throw err;
      if(req.params.type === "food"){
        data.food.push(req.body.id);
      }else if(req.params.type === "recipe"){
        data.recipe.push(req.body.id);
      }else if(req.params.type === "activity"){
        data.activity.push(req.body.id);
      }
      data.save();
    });
  });

  app.get('/api/list', function(req, res) {
    List.findOne({"userID" : req.user._id}, function(err, data) {
      if(err)
        throw err;
      var foods = [];
      var recipes = [];
      var activitys = [];

      for (var i = data.food.length - 1; i >= 0; i--) {
        Matis.findOne({"_id" : data.food[i]}, callerBack(err, result, foods));
      }

      for (var j = data.recipe.length - 1; j >= 0; j--) {
        Recipe.findOne({"_id" : data.recipe[j]}, callerBack(err, result, recipes));
      }

      function callerBack(err, data, list) {
        if(err)
          throw err;
        list.push(data);
      }

      var allLists = {
        food : foods,
        recipe : recipes,
        activity : activitys
      };

      res.send(allLists);

    });
  });

// Calender

  app.get('/api/calender', function(req, res) {
    Calender.findOne({"userID" : req.user._id}, function(err, data) {
      if(err)
        throw err;
      res.send(data);
    });
  });

  app.post('/api/calender', function(req, res) {
    Calender.findOne({"userID" : req.user._id}, function(err, data) {
      if(err)
        throw err;

      if(data === null)
        data = new Calender();
      

      data.userID = req.user._id;
      data.calenderObj = req.body.calender;
      data.save();
      res.send(data);
    });
  });

  app.delete('/api/calender', function(req, res) {
    Calender.find({ "calenderObj" : req.body.calender }).remove().exec();
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
