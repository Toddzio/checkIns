var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var childSchema = mongoose.Schema({
	user: {},
	fname: {type: String, required: true},
	lname: {type: String, required: true},
	url: String,
	qrCode: String,
	checkins: [{

	}]
});

module.exports = mongoose.model('Child', childSchema);