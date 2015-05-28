// /models/calander.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our profile model
var calenderSchema = mongoose.Schema({

	userID		: String,
	calenderObj	: [],

}, {collection : 'Calender'});

module.exports = mongoose.model('Calender', calenderSchema);
