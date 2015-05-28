// /models/blog.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our blog model
var blogSchema = mongoose.Schema({

  userID  : String,
  title   : String,
  author  : String,
  body    : String,
  comments: [{ commenter : String, body: String, date: { type: Date, default: Date.now }}],
  date    : { type: Date, default: Date.now },
  edited  : Boolean,
  meta    : {
    votes : Number,
    favs  : Number
  },
  tags    : []

}, {collection : 'Blog'});

module.exports = mongoose.model('Blog', blogSchema);
