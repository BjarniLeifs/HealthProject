// server.js

// set up 
// get all the tools we need
var express  = require('express'),
  app       = express(),
  port      = (process.env.PORT || 3000),
  mongoose  = require('mongoose'),
  passport  = require('passport'),
  flash     = require('connect-flash'),
  path      = require('path');

var clientDir = path.join(__dirname, '/');
var configDB = require('./config/database.js');

// configuration
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

  // set up our express application
  app.use(express.logger('dev')); // log every request to the console
  app.use(express.cookieParser()); // read cookies (needed for auth)
  app.use(express.bodyParser()); // get information from html forms

  // required for passport
  app.use(express.session({ secret: 'fdZwwX3124dcW4324Fwwcl5g5',
                            expires : new Date(Date.now() + 360000000)})); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session
  app.use(express.static(clientDir));

});

// routes 
require('./routes/userR.js')(app, passport, mongoose);
require('./routes/foodR.js')(app, mongoose);
require('./routes/blogR.js')(app, passport, mongoose);
require('./routes/listR.js')(app, passport, mongoose);
require('./routes/trainerR.js')(app, passport, mongoose);


// launch 
app.listen(port);

console.log('The magic happens on port ' + port);
