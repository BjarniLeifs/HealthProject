// /models/recipe.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our recipe model
var recipeSchema = mongoose.Schema({

	userID		: String,
    title       : String,
    body		: String,
    steps		: [{body : String}],
    ingredients	: [{produce : String, amount : Number, unit : String}],
    tags		: []

}, {collection : 'Recipes'});

module.exports = mongoose.model('Recipes', recipeSchema);
