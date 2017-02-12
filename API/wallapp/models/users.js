var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
//Defining user model
var UserSchema = new Schema({
	first_name: {
		type: String,
		required:true
	},
	last_name:{
		type: String,
		default:""
	},
	display_name:{
		type: String,
		required: true,
		unique:true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select:false
	},
	active: {
		type: Boolean,
		required: true,
		default:false
	},
	temporaryToken: {
		type: String,
		required: true
	},
	resettoken: {
		type: String,
		required: false
	},

	created: {
		type: Date,
		default: Date.now
	}
});
//Password encryption method for user creation
UserSchema.pre('save', function(next){

	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;	
		next();	
	});
})

//Password matching method
UserSchema.methods.checkPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);