// server.js

// set up 
// get all the tools we need
var express       = require('express');
var app           = express();
var port          = (process.env.PORT || 3000);
var mongoose      = require('mongoose');
var passport      = require('passport');
var flash         = require('connect-flash');
var path          = require('path');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var morgan        = require('morgan');
var session       = require('express-session'); 

var configDB      = require('./config/database.js');

// configuration
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'fdZwwX3124dcW4324Fwwcl5g5',
                  resave: false,
                  saveUninitalized: true,      
                  expires : new Date(Date.now() + 360000000)})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(__dirname + '/'));


// app configureation

var env = process.env.NODE_ENV || 'development';
if('development' == env) {
  // configure stuff here
}


// routes 
require('./routes/userR.js')(app, passport, mongoose);
require('./routes/foodR.js')(app, mongoose);
require('./routes/blogR.js')(app, passport, mongoose);
require('./routes/listR.js')(app, passport, mongoose);
require('./routes/trainerR.js')(app, passport, mongoose);


// launch 
app.listen(port);

console.log('The magic happens on port ' + port);