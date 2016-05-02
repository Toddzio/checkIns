var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local : {
	email: {type: String, required: true, unique: true},
	password: String,
	fname: { type: String, required: true },
	lname: { type: String, required: true },
  },
  children: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created_at: Date,
  updated_at: Date
});


userSchema.statics.hash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);