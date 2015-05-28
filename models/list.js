// /models/calander.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our profile model
var listSchema = mongoose.Schema({

	userID		: String,
	food		: [],
    recipe      : [],
    activity    : []

}, {collection : 'List'});

module.exports = mongoose.model('List', listSchema);
