// /models/profile.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our profile model
var messageSchema = mongoose.Schema({

	senderID	: String,
	recID		: String,
	senName		: String,
    title       : String,
    message     : String,
    date        : { type: Date, default: Date.now },
    read        : Boolean

}, {collection : 'Messages'});

module.exports = mongoose.model('Messages', messageSchema);
