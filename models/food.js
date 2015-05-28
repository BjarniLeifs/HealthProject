// /models/food.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our food model
var foodSchema = mongoose.Schema({

	"Nafn"									: String,
	"Name"									: String,
	"Fæðuflokkur"							: String,
	"Aðalfl"								: String,
	"Undirfl"								: String,
	"Ætur hluti"							: Number,
	"Prótein"								: Number,
	"Fita"									: Number,
	"Mettaðar fitusýrur"					: Number,
	"cis-Einómettaðar fitusýrur"			: Number,
	"cis-Fjölómettaðar fitusýrur"			: Number,
	"cis-Fjölómettaðar fitus. n-3 langar"	: Number,
	"trans-Fitusýrur"						: Number,
	"Kólesteról"							: Number,
	"Kolvetni, alls"						: Number,
	"Sykrur"								: Number,
	"Viðbættur sykur"						: Number,
	"Trefjaefni"							: Number,
	"Alkóhól"								: Number,
	"Steinefni, alls"						: Number,
	"Vatn"									: Number,
	"A-vítamín, RJ"							: Number,
	"Retinol"								: Number,
	"Beta-karótín"							: Number,
	"D-vítamín"								: Number,
	"E-vítamín, alfa-TJ"					: Number,
	"B1-vítamín"							: Number,
	"B2-vítamín"							: Number,
	"Níasín-jafngildi"						: Number,
	"Níasín"								: Number,
	"B6-vítamín"							: Number,
	"Fólat, alls"							: Number,
	"B-12 vítamín"							: Number,
	"C-vítamín"								: Number,
	"Kalk"									: Number,
	"Fosfór"								: Number,
	"Magnesíum"								: Number,
	"Natríum"								: Number,
	"Kalíum"								: Number,
	"Járn"									: Number,
	"Sink"									: Number,
	"Kopar"									: Number,
	"Joð"									: Number,
	"Selen"									: Number,
	"cis-Fjölómettaðar fitus. n-6"			: Number,
	"cis-Fjölómettaðar fitus. n-3"			: Number

}, {collection : 'matis'});

module.exports = mongoose.model('Matis', foodSchema);
