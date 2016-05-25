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


String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

childSchema.statics.generateURL = function(fname, lname){
	var myHash = (Math.abs(fname.concat(lname).hashCode())).toString();
	var myDate = new Date().getTime().toString();
	var url = myHash.concat(myDate);
	return url;
}

var Child = mongoose.model('Child', childSchema);
module.exports = Child;